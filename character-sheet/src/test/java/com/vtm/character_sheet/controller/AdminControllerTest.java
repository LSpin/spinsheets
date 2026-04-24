package com.vtm.character_sheet.controller;

import com.vtm.character_sheet.entity.AppUser;
import com.vtm.character_sheet.entity.Role;
import com.vtm.character_sheet.repository.AppUserRepository;
import com.vtm.character_sheet.security.CharacterAccessChecker;
import com.vtm.character_sheet.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    @Mock private AppUserRepository userRepository;
    @Mock private CharacterAccessChecker access;
    @Mock private AuthService authService;

    @InjectMocks private AdminController controller;

    private AppUser admin;
    private AppUser player;

    @BeforeEach
    void setUp() {
        admin = new AppUser();
        admin.setId(1L);
        admin.setUsername("admin");
        admin.setEmail("admin@test.com");
        admin.setRole(Role.ADMIN);
        admin.setCreatedAt(LocalDateTime.now());

        player = new AppUser();
        player.setId(2L);
        player.setUsername("player1");
        player.setEmail("player@test.com");
        player.setRole(Role.PLAYER);
        player.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void listUsersDeniedForNonAdmin() {
        AppUser nonAdmin = new AppUser();
        nonAdmin.setRole(Role.STORYTELLER);
        when(access.getCurrentUser()).thenReturn(nonAdmin);

        ResponseEntity<?> result = controller.listUsers();

        assertEquals(403, result.getStatusCode().value());
    }

    @Test
    void listUsersAllowedForAdmin() {
        when(access.getCurrentUser()).thenReturn(admin);
        when(userRepository.findAll()).thenReturn(List.of(admin, player));

        ResponseEntity<?> result = controller.listUsers();

        assertEquals(200, result.getStatusCode().value());
    }

    @Test
    void deleteUserDeniedForNonAdmin() {
        AppUser nonAdmin = new AppUser();
        nonAdmin.setRole(Role.PLAYER);
        when(access.getCurrentUser()).thenReturn(nonAdmin);

        ResponseEntity<?> result = controller.deleteUser(2L);

        assertEquals(403, result.getStatusCode().value());
        verify(authService, never()).deleteAccount(any());
    }

    @Test
    void deleteUserSucceedsForAdmin() {
        when(access.getCurrentUser()).thenReturn(admin);
        when(userRepository.findById(2L)).thenReturn(Optional.of(player));

        ResponseEntity<?> result = controller.deleteUser(2L);

        assertEquals(200, result.getStatusCode().value());
        verify(authService).deleteAccount("player1");
    }

    @Test
    void cannotDeleteAdminAccount() {
        when(access.getCurrentUser()).thenReturn(admin);
        AppUser otherAdmin = new AppUser();
        otherAdmin.setId(3L);
        otherAdmin.setRole(Role.ADMIN);
        when(userRepository.findById(3L)).thenReturn(Optional.of(otherAdmin));

        ResponseEntity<?> result = controller.deleteUser(3L);

        assertEquals(400, result.getStatusCode().value());
        verify(authService, never()).deleteAccount(any());
    }

    @Test
    void deleteNonexistentUserReturns404() {
        when(access.getCurrentUser()).thenReturn(admin);
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        ResponseEntity<?> result = controller.deleteUser(999L);

        assertEquals(404, result.getStatusCode().value());
    }
}
