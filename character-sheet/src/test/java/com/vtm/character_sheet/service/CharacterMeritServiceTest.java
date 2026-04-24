package com.vtm.character_sheet.service;

import com.vtm.character_sheet.entity.Character;
import com.vtm.character_sheet.entity.*;
import com.vtm.character_sheet.repository.CharacterFlawRepository;
import com.vtm.character_sheet.repository.CharacterMeritRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CharacterMeritServiceTest {

    @Mock private CharacterMeritRepository meritRepository;
    @Mock private CharacterFlawRepository flawRepository;
    @Mock private CharacterService characterService;
    @Mock private MeritService meritService;
    @Mock private FlawService flawService;

    @InjectMocks private CharacterMeritService service;

    @Test
    void addMeritLinksCharacterAndMerit() {
        Character c = new Character();
        c.setId(1L);
        Merit m = new Merit();
        m.setId(10L);
        m.setName("Acute Senses");

        when(characterService.findById(1L)).thenReturn(Optional.of(c));
        when(meritService.findById(10L)).thenReturn(Optional.of(m));
        when(meritRepository.save(any(CharacterMerit.class))).thenAnswer(inv -> inv.getArgument(0));

        CharacterMerit result = service.addMerit(1L, 10L, 1);

        assertEquals(c, result.getCharacter());
        assertEquals(m, result.getMerit());
        assertEquals(1, result.getPointsSpent());
    }

    @Test
    void addMeritThrowsForMissingCharacter() {
        when(characterService.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.addMerit(999L, 1L, 1));
    }

    @Test
    void addMeritThrowsForMissingMerit() {
        when(characterService.findById(1L)).thenReturn(Optional.of(new Character()));
        when(meritService.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.addMerit(1L, 999L, 1));
    }

    @Test
    void addFlawLinksCharacterAndFlaw() {
        Character c = new Character();
        c.setId(1L);
        Flaw f = new Flaw();
        f.setId(20L);
        f.setName("Bad Sight");

        when(characterService.findById(1L)).thenReturn(Optional.of(c));
        when(flawService.findById(20L)).thenReturn(Optional.of(f));
        when(flawRepository.save(any(CharacterFlaw.class))).thenAnswer(inv -> inv.getArgument(0));

        CharacterFlaw result = service.addFlaw(1L, 20L, 2);

        assertEquals(c, result.getCharacter());
        assertEquals(f, result.getFlaw());
        assertEquals(2, result.getPointsGained());
    }

    @Test
    void getMeritsDelegatesToRepository() {
        when(meritRepository.findByCharacterId(5L)).thenReturn(List.of());
        assertTrue(service.getMerits(5L).isEmpty());
    }

    @Test
    void getFlawsDelegatesToRepository() {
        when(flawRepository.findByCharacterId(5L)).thenReturn(List.of());
        assertTrue(service.getFlaws(5L).isEmpty());
    }

    @Test
    void removeMeritDelegatesToRepository() {
        service.removeMerit(42L);
        verify(meritRepository).deleteById(42L);
    }

    @Test
    void removeFlawDelegatesToRepository() {
        service.removeFlaw(42L);
        verify(flawRepository).deleteById(42L);
    }
}
