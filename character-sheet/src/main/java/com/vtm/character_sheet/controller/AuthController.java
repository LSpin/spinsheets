package com.vtm.character_sheet.controller;

import com.vtm.character_sheet.security.CharacterAccessChecker;
import com.vtm.character_sheet.repository.AppUserRepository;
import com.vtm.character_sheet.service.AuthService;
import com.vtm.character_sheet.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CharacterAccessChecker access;
    private final AppUserRepository userRepository;
    private final NotificationService notificationService;
    private final com.vtm.character_sheet.security.JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String password = body.get("password");
        String role = body.getOrDefault("role", "PLAYER");

        if (username == null || email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "All fields are required"));
        }
        String passwordError = validatePassword(password);
        if (passwordError != null) {
            return ResponseEntity.badRequest().body(Map.of("error", passwordError));
        }

        try {
            var result = authService.register(username.trim(), email.trim(), password, role.trim());
            log.info("User registered: {}", username.trim());
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            log.warn("Registration failed for {}: {}", username, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required"));
        }

        try {
            return ResponseEntity.ok(authService.login(username.trim(), password));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Refresh token is required"));
        }
        if (!jwtUtil.isValid(refreshToken) || !jwtUtil.isRefreshToken(refreshToken)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired refresh token"));
        }
        String username = jwtUtil.getUsername(refreshToken);
        return userRepository.findByUsername(username)
                .<ResponseEntity<?>>map(user -> {
                    String newToken = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
                    String newRefresh = jwtUtil.generateRefreshToken(user.getUsername());
                    return ResponseEntity.ok(Map.of(
                            "token", newToken,
                            "refreshToken", newRefresh,
                            "userId", user.getId(),
                            "username", user.getUsername(),
                            "role", user.getRole().name()
                    ));
                })
                .orElse(ResponseEntity.status(401).body(Map.of("error", "User not found")));
    }

    @GetMapping("/users")
    public ResponseEntity<?> listUsers() {
        if (!access.isStoryteller()) {
            return ResponseEntity.status(403).body(Map.of("error", "Storyteller access required"));
        }
        List<Map<String, Object>> users = userRepository.findAll().stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "username", u.getUsername(),
                        "role", u.getRole().name(),
                        "createdAt", u.getCreatedAt().toString()
                ))
                .toList();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<?> deleteAccount() {
        try {
            String username = access.getCurrentUser().getUsername();
            authService.deleteAccount(username);
            return ResponseEntity.ok(Map.of("message", "Account deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        // Always return success to prevent email enumeration
        try {
            var user = userRepository.findByEmail(email.trim());
            if (user.isPresent()) {
                String token = authService.createResetToken(user.get().getUsername());
                notificationService.sendPasswordResetEmail(user.get(), token);
            }
        } catch (Exception e) {
            // Silently fail — don't reveal whether email exists
        }
        return ResponseEntity.ok(Map.of("message", "If an account with that email exists, a reset link has been sent."));
    }

    @PostMapping("/reset-request")
    public ResponseEntity<?> requestReset(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        if (username == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
        }

        // Only Storytellers can generate reset tokens (since no email service)
        try {
            if (!access.isStoryteller()) {
                return ResponseEntity.status(403)
                        .body(Map.of("error", "Contact your Storyteller to reset your password"));
            }
            String token = authService.createResetToken(username.trim());
            return ResponseEntity.ok(Map.of("resetToken", token));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token and new password are required"));
        }
        String passwordError = validatePassword(newPassword);
        if (passwordError != null) {
            return ResponseEntity.badRequest().body(Map.of("error", passwordError));
        }

        try {
            authService.resetPassword(token.trim(), newPassword);
            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private String validatePassword(String password) {
        if (password.length() < 8) return "Password must be at least 8 characters";
        if (!password.matches(".*[A-Z].*")) return "Password must contain at least one uppercase letter";
        if (!password.matches(".*[a-z].*")) return "Password must contain at least one lowercase letter";
        if (!password.matches(".*\\d.*")) return "Password must contain at least one number";
        return null;
    }

}
