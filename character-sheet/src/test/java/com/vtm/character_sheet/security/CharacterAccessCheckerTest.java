package com.vtm.character_sheet.security;

import com.vtm.character_sheet.entity.AppUser;
import com.vtm.character_sheet.entity.Character;
import com.vtm.character_sheet.entity.Chronicle;
import com.vtm.character_sheet.entity.Role;
import com.vtm.character_sheet.repository.AppUserRepository;
import com.vtm.character_sheet.repository.CharacterRepository;
import com.vtm.character_sheet.repository.ChronicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CharacterAccessCheckerTest {

    @Mock private CharacterRepository characterRepository;
    @Mock private ChronicleRepository chronicleRepository;
    @Mock private AppUserRepository userRepository;

    @InjectMocks private CharacterAccessChecker checker;

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

    private void setCurrentUser(String username) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(username, null, java.util.List.of()));
    }

    @Test
    void playerCanAccessOwnCharacter() {
        setCurrentUser("player1");
        when(userRepository.findByUsername("player1")).thenReturn(Optional.of(player));

        Character c = new Character();
        c.setId(10L);
        c.setOwner(player);
        when(characterRepository.findById(10L)).thenReturn(Optional.of(c));

        assertTrue(checker.canAccess(10L));
    }

    @Test
    void playerCannotAccessOtherCharacter() {
        setCurrentUser("player1");
        when(userRepository.findByUsername("player1")).thenReturn(Optional.of(player));

        AppUser otherPlayer = new AppUser();
        otherPlayer.setId(99L);

        Character c = new Character();
        c.setId(10L);
        c.setOwner(otherPlayer);
        when(characterRepository.findById(10L)).thenReturn(Optional.of(c));

        assertFalse(checker.canAccess(10L));
    }

    @Test
    void storytellerCanAccessAnyExistingCharacter() {
        setCurrentUser("st1");
        when(userRepository.findByUsername("st1")).thenReturn(Optional.of(storyteller));
        when(characterRepository.existsById(10L)).thenReturn(true);

        assertTrue(checker.canAccess(10L));
    }

    @Test
    void storytellerCannotAccessNonexistent() {
        setCurrentUser("st1");
        when(userRepository.findByUsername("st1")).thenReturn(Optional.of(storyteller));
        when(characterRepository.existsById(999L)).thenReturn(false);

        assertFalse(checker.canAccess(999L));
    }

    @Test
    void assistantSTCanAccessChronicleCharacters() {
        setCurrentUser("player1");
        when(userRepository.findByUsername("player1")).thenReturn(Optional.of(player));

        AppUser otherPlayer = new AppUser();
        otherPlayer.setId(88L);

        Chronicle chronicle = new Chronicle();
        chronicle.setId(5L);
        chronicle.setAssistantStorytellers(Set.of(player));

        Character c = new Character();
        c.setId(20L);
        c.setOwner(otherPlayer);
        c.setChronicle(chronicle);
        when(characterRepository.findById(20L)).thenReturn(Optional.of(c));

        assertTrue(checker.canAccess(20L));
    }

    @Test
    void isStorytellerReturnsCorrectly() {
        setCurrentUser("player1");
        when(userRepository.findByUsername("player1")).thenReturn(Optional.of(player));
        assertFalse(checker.isStoryteller());

        setCurrentUser("st1");
        when(userRepository.findByUsername("st1")).thenReturn(Optional.of(storyteller));
        assertTrue(checker.isStoryteller());
    }

    @Test
    void nonexistentCharacterReturnsFalse() {
        setCurrentUser("player1");
        when(userRepository.findByUsername("player1")).thenReturn(Optional.of(player));
        when(characterRepository.findById(999L)).thenReturn(Optional.empty());

        assertFalse(checker.canAccess(999L));
    }
}
