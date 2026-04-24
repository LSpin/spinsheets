package com.vtm.character_sheet.controller;

import com.vtm.character_sheet.entity.AppUser;
import com.vtm.character_sheet.entity.Character;
import com.vtm.character_sheet.entity.Chronicle;
import com.vtm.character_sheet.entity.Role;
import com.vtm.character_sheet.repository.CharacterRepository;
import com.vtm.character_sheet.security.CharacterAccessChecker;
import com.vtm.character_sheet.service.CharacterService;
import com.vtm.character_sheet.service.ChronicleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CharacterControllerTest {

    @Mock private CharacterService service;
    @Mock private ChronicleService chronicleService;
    @Mock private CharacterRepository characterRepository;
    @Mock private CharacterAccessChecker access;

    @InjectMocks private CharacterController controller;

    private AppUser player;
    private AppUser storyteller;

    @BeforeEach
    void setUp() {
        player = new AppUser();
        player.setId(1L);
        player.setUsername("player1");
        player.setRole(Role.PLAYER);

        storyteller = new AppUser();
        storyteller.setId(2L);
        storyteller.setUsername("st1");
        storyteller.setRole(Role.STORYTELLER);
    }

    @Test
    void findAllForPlayerReturnsOwnCharacters() {
        when(access.getCurrentUser()).thenReturn(player);
        Character c = new Character();
        c.setName("My Vampire");
        when(service.findByOwner(1L)).thenReturn(List.of(c));

        List<Character> result = controller.findAll(null, null);

        assertEquals(1, result.size());
        assertEquals("My Vampire", result.get(0).getName());
    }

    @Test
    void findAllForSTIncludesChronicleCharacters() {
        when(access.getCurrentUser()).thenReturn(storyteller);

        Character ownChar = new Character();
        ownChar.setId(1L);
        ownChar.setName("ST's char");
        when(service.findByOwner(2L)).thenReturn(List.of(ownChar));

        Character chronicleChar = new Character();
        chronicleChar.setId(2L);
        chronicleChar.setName("Player's char");
        when(characterRepository.findByChronicleStorytellerId(2L)).thenReturn(List.of(chronicleChar));

        List<Character> result = controller.findAll(null, null);

        assertEquals(2, result.size());
    }

    @Test
    void findByIdDeniedWhenNoAccess() {
        when(access.canAccess(10L)).thenReturn(false);

        ResponseEntity<Character> result = controller.findById(10L);

        assertEquals(403, result.getStatusCode().value());
    }

    @Test
    void findByIdReturnsCharacter() {
        when(access.canAccess(10L)).thenReturn(true);
        Character c = new Character();
        c.setId(10L);
        c.setName("Found");
        when(service.findById(10L)).thenReturn(Optional.of(c));

        ResponseEntity<Character> result = controller.findById(10L);

        assertEquals(200, result.getStatusCode().value());
        assertEquals("Found", result.getBody().getName());
    }

    @Test
    void findByIdReturns404WhenMissing() {
        when(access.canAccess(999L)).thenReturn(true);
        when(service.findById(999L)).thenReturn(Optional.empty());

        ResponseEntity<Character> result = controller.findById(999L);

        assertEquals(404, result.getStatusCode().value());
    }

    @Test
    void createSetsOwnerToCurrentUser() {
        when(access.getCurrentUser()).thenReturn(player);
        Character c = new Character();
        c.setName("New Char");
        when(service.save(c)).thenReturn(c);

        Character result = controller.create(c);

        assertEquals(player, result.getOwner());
        verify(service).save(c);
    }

    @Test
    void deleteDeniedWhenNoAccess() {
        when(access.canAccess(10L)).thenReturn(false);

        ResponseEntity<Void> result = controller.delete(10L);

        assertEquals(403, result.getStatusCode().value());
        verify(service, never()).deleteById(any());
    }

    @Test
    void deleteSucceedsWithAccess() {
        when(access.canAccess(10L)).thenReturn(true);
        when(access.getCurrentUser()).thenReturn(player);
        when(service.findById(10L)).thenReturn(Optional.of(new Character()));

        ResponseEntity<Void> result = controller.delete(10L);

        assertEquals(204, result.getStatusCode().value());
        verify(service).deleteById(10L);
    }

    @Test
    void joinChronicleChecksAccess() {
        when(access.canAccess(10L)).thenReturn(false);

        ResponseEntity<?> result = controller.joinChronicle(10L, 1L);

        assertEquals(403, result.getStatusCode().value());
    }

    @Test
    void joinChronicleValidatesSplat() {
        when(access.canAccess(10L)).thenReturn(true);

        Character c = new Character();
        c.setId(10L);
        c.setSplat("DND");
        when(service.findById(10L)).thenReturn(Optional.of(c));

        Chronicle chron = new Chronicle();
        chron.setId(1L);
        chron.setGameSystem("WOD");
        chron.setAllowedSplats("VAMPIRE");
        when(chronicleService.findById(1L)).thenReturn(Optional.of(chron));

        ResponseEntity<?> result = controller.joinChronicle(10L, 1L);

        assertEquals(400, result.getStatusCode().value());
    }

    @Test
    void leaveChronicleNullifiesChronicle() {
        when(access.canAccess(10L)).thenReturn(true);
        Character c = new Character();
        c.setId(10L);
        Chronicle chron = new Chronicle();
        c.setChronicle(chron);
        when(service.findById(10L)).thenReturn(Optional.of(c));
        when(service.save(c)).thenReturn(c);

        ResponseEntity<Character> result = controller.leaveChronicle(10L);

        assertEquals(200, result.getStatusCode().value());
        assertNull(c.getChronicle());
    }
}
