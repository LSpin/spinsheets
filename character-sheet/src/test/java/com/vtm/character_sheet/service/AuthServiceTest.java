package com.vtm.character_sheet.service;

import com.vtm.character_sheet.entity.AppUser;
import com.vtm.character_sheet.entity.PasswordResetToken;
import com.vtm.character_sheet.entity.Role;
import com.vtm.character_sheet.repository.AppUserRepository;
import com.vtm.character_sheet.repository.CharacterRepository;
import com.vtm.character_sheet.repository.ChronicleRepository;
import com.vtm.character_sheet.repository.PasswordResetTokenRepository;
import com.vtm.character_sheet.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private AppUserRepository userRepository;
    @Mock private CharacterRepository characterRepository;
    @Mock private ChronicleRepository chronicleRepository;
    @Mock private PasswordResetTokenRepository resetTokenRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private NotificationService notificationService;

    @InjectMocks private AuthService authService;

    private AppUser testUser;

    @BeforeEach
    void setUp() {
        testUser = new AppUser();
        testUser.setId(1L);
        testUser.setUsername("alice");
        testUser.setEmail("alice@test.com");
        testUser.setPasswordHash("hashed");
        testUser.setRole(Role.PLAYER);
    }

    @Test
    void registerCreatesPlayerByDefault() {
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(passwordEncoder.encode("Password1")).thenReturn("encoded");
        when(userRepository.save(any(AppUser.class))).thenAnswer(inv -> {
            AppUser u = inv.getArgument(0);
            u.setId(99L);
            return u;
        });
        when(jwtUtil.generateToken("newuser", "PLAYER")).thenReturn("jwt-token");
        when(jwtUtil.generateRefreshToken("newuser")).thenReturn("refresh-token");

        Map<String, Object> result = authService.register("newuser", "new@test.com", "Password1", "PLAYER");

        assertEquals("jwt-token", result.get("token"));
        assertEquals("refresh-token", result.get("refreshToken"));
        assertEquals("newuser", result.get("username"));
        assertEquals("PLAYER", result.get("role"));
        verify(notificationService).notifyRegistration(any());
        verify(notificationService).sendWelcomeEmail(any());
    }

    @Test
    void registerAsStoryteller() {
        when(userRepository.existsByUsername("st")).thenReturn(false);
        when(userRepository.existsByEmail("st@test.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encoded");
        when(userRepository.save(any(AppUser.class))).thenAnswer(inv -> {
            AppUser u = inv.getArgument(0);
            u.setId(99L);
            return u;
        });
        when(jwtUtil.generateToken("st", "STORYTELLER")).thenReturn("st-token");
        when(jwtUtil.generateRefreshToken("st")).thenReturn("st-refresh");

        Map<String, Object> result = authService.register("st", "st@test.com", "Password1", "STORYTELLER");

        assertEquals("STORYTELLER", result.get("role"));
    }

    @Test
    void registerDuplicateUsernameThrows() {
        when(userRepository.existsByUsername("taken")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> authService.register("taken", "x@test.com", "Password1", "PLAYER"));
        assertEquals("Username already taken", ex.getMessage());
    }

    @Test
    void registerDuplicateEmailThrows() {
        when(userRepository.existsByUsername("new")).thenReturn(false);
        when(userRepository.existsByEmail("taken@test.com")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> authService.register("new", "taken@test.com", "Password1", "PLAYER"));
        assertEquals("Email already registered", ex.getMessage());
    }

    @Test
    void loginReturnsTokenAndUserInfo() {
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(testUser));
        when(jwtUtil.generateToken("alice", "PLAYER")).thenReturn("login-token");
        when(jwtUtil.generateRefreshToken("alice")).thenReturn("login-refresh");

        Map<String, Object> result = authService.login("alice", "Password1");

        assertEquals("login-token", result.get("token"));
        assertEquals("alice", result.get("username"));
        assertEquals("PLAYER", result.get("role"));
        assertEquals(1L, result.get("userId"));
    }

    @Test
    void resetPasswordWithValidToken() {
        PasswordResetToken token = new PasswordResetToken();
        token.setToken("valid-uuid");
        token.setUser(testUser);
        token.setExpiresAt(LocalDateTime.now().plusHours(1));
        token.setUsed(false);

        when(resetTokenRepository.findByToken("valid-uuid")).thenReturn(Optional.of(token));
        when(passwordEncoder.encode("NewPass1")).thenReturn("new-hash");

        authService.resetPassword("valid-uuid", "NewPass1");

        assertEquals("new-hash", testUser.getPasswordHash());
        assertTrue(token.isUsed());
        verify(userRepository).save(testUser);
        verify(resetTokenRepository).save(token);
    }

    @Test
    void resetPasswordWithUsedTokenThrows() {
        PasswordResetToken token = new PasswordResetToken();
        token.setToken("used-uuid");
        token.setUser(testUser);
        token.setExpiresAt(LocalDateTime.now().plusHours(1));
        token.setUsed(true);

        when(resetTokenRepository.findByToken("used-uuid")).thenReturn(Optional.of(token));

        assertThrows(IllegalArgumentException.class,
                () -> authService.resetPassword("used-uuid", "NewPass1"));
    }

    @Test
    void resetPasswordWithExpiredTokenThrows() {
        PasswordResetToken token = new PasswordResetToken();
        token.setToken("expired-uuid");
        token.setUser(testUser);
        token.setExpiresAt(LocalDateTime.now().minusHours(1));
        token.setUsed(false);

        when(resetTokenRepository.findByToken("expired-uuid")).thenReturn(Optional.of(token));

        assertThrows(IllegalArgumentException.class,
                () -> authService.resetPassword("expired-uuid", "NewPass1"));
    }

    @Test
    void deleteAccountRemovesAllUserData() {
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(testUser));
        when(characterRepository.findByOwner_Id(1L)).thenReturn(List.of());
        when(chronicleRepository.findByStoryteller_Id(1L)).thenReturn(List.of());
        when(resetTokenRepository.findAll()).thenReturn(List.of());

        authService.deleteAccount("alice");

        verify(userRepository).delete(testUser);
        verify(notificationService).notifyAccountDeletion(testUser);
        verify(notificationService).sendAccountDeletedEmail(testUser);
    }
}
