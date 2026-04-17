package com.vtm.character_sheet.controller;

import com.vtm.character_sheet.entity.AppUser;
import com.vtm.character_sheet.repository.AppUserRepository;
import com.vtm.character_sheet.security.CharacterAccessChecker;
import com.vtm.character_sheet.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private static final String SUPER_ADMIN = "spin";

    private final AppUserRepository userRepository;
    private final CharacterAccessChecker access;
    private final AuthService authService;

    private boolean isSuperAdmin() {
        return access.getCurrentUser().getUsername().equals(SUPER_ADMIN);
    }

    @GetMapping("/users")
    public ResponseEntity<?> listUsers() {
        if (!isSuperAdmin()) {
            return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
        }
        List<Map<String, Object>> users = userRepository.findAll().stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "username", u.getUsername(),
                        "email", u.getEmail(),
                        "role", u.getRole().name(),
                        "createdAt", u.getCreatedAt().toString()
                ))
                .toList();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!isSuperAdmin()) {
            return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
        }
        return userRepository.findById(id).map(user -> {
            if (user.getUsername().equals(SUPER_ADMIN)) {
                return ResponseEntity.badRequest().body((Object) Map.of("error", "Cannot delete the super admin account"));
            }
            authService.deleteAccount(user.getUsername());
            return ResponseEntity.ok((Object) Map.of("message", "User deleted"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
