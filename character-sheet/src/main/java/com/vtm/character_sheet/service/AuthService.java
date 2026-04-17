package com.vtm.character_sheet.service;

import com.vtm.character_sheet.entity.AppUser;
import com.vtm.character_sheet.entity.PasswordResetToken;
import com.vtm.character_sheet.entity.Role;
import com.vtm.character_sheet.repository.AppUserRepository;
import com.vtm.character_sheet.repository.CharacterRepository;
import com.vtm.character_sheet.repository.ChronicleRepository;
import com.vtm.character_sheet.repository.PasswordResetTokenRepository;
import com.vtm.character_sheet.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository userRepository;
    private final CharacterRepository characterRepository;
    private final ChronicleRepository chronicleRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final NotificationService notificationService;

    public Map<String, Object> register(String username, String email, String password, String role) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        AppUser user = new AppUser();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole("STORYTELLER".equalsIgnoreCase(role) ? Role.STORYTELLER : Role.PLAYER);

        userRepository.save(user);
        notificationService.notifyRegistration(user);
        notificationService.sendWelcomeEmail(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return authResponse(token, user);
    }

    public Map<String, Object> login(String username, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));

        AppUser user = userRepository.findByUsername(username).orElseThrow();
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return authResponse(token, user);
    }

    public String createResetToken(String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(UUID.randomUUID().toString());
        resetToken.setUser(user);
        resetToken.setExpiresAt(LocalDateTime.now().plusHours(1));
        resetTokenRepository.save(resetToken);

        return resetToken.getToken();
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = resetTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid reset token"));

        if (resetToken.isUsed()) throw new IllegalArgumentException("Token already used");
        if (resetToken.isExpired()) throw new IllegalArgumentException("Token expired");

        AppUser user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        resetTokenRepository.save(resetToken);
    }

    @Transactional
    public void deleteAccount(String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Delete all characters owned by this user
        characterRepository.findByOwner_Id(user.getId())
                .forEach(c -> characterRepository.delete(c));

        // Delete chronicles where user is storyteller
        chronicleRepository.findByStoryteller_Id(user.getId())
                .forEach(c -> chronicleRepository.delete(c));

        // Remove password reset tokens
        resetTokenRepository.findAll().stream()
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .forEach(resetTokenRepository::delete);

        userRepository.delete(user);
    }

    private Map<String, Object> authResponse(String token, AppUser user) {
        return Map.of(
                "token", token,
                "userId", user.getId(),
                "username", user.getUsername(),
                "role", user.getRole().name()
        );
    }
}
