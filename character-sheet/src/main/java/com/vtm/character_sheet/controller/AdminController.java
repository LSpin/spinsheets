package com.vtm.character_sheet.controller;

import com.vtm.character_sheet.entity.AppUser;
import com.vtm.character_sheet.entity.Role;
import com.vtm.character_sheet.repository.AppUserRepository;
import com.vtm.character_sheet.security.CharacterAccessChecker;
import com.vtm.character_sheet.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AppUserRepository userRepository;
    private final CharacterAccessChecker access;
    private final AuthService authService;

    private boolean isAdmin() {
        return access.getCurrentUser().getRole() == Role.ADMIN;
    }

    @GetMapping("/users")
    public ResponseEntity<?> listUsers() {
        if (!isAdmin()) {
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
        log.info("Admin {} listed all users", access.getCurrentUser().getUsername());
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!isAdmin()) {
            return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
        }
        return userRepository.findById(id).map(user -> {
            if (user.getRole() == Role.ADMIN) {
                return ResponseEntity.badRequest().body((Object) Map.of("error", "Cannot delete an admin account"));
            }
            log.info("Admin {} deleted user {}", access.getCurrentUser().getUsername(), user.getUsername());
            authService.deleteAccount(user.getUsername());
            return ResponseEntity.ok((Object) Map.of("message", "User deleted"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
