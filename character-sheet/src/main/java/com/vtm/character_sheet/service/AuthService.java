package com.vtm.character_sheet.service;

import com.vtm.character_sheet.entity.AppUser;
import com.vtm.character_sheet.entity.Role;
import com.vtm.character_sheet.repository.AppUserRepository;
import com.vtm.character_sheet.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

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

    private Map<String, Object> authResponse(String token, AppUser user) {
        return Map.of(
                "token", token,
                "userId", user.getId(),
                "username", user.getUsername(),
                "role", user.getRole().name()
        );
    }
}
