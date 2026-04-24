package com.vtm.character_sheet.service;

import com.vtm.character_sheet.entity.Character;
import com.vtm.character_sheet.repository.CharacterRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CharacterServiceTest {

    @Mock private CharacterRepository repository;
    @InjectMocks private CharacterService service;

    @Test
    void findByOwnerDelegatesToRepository() {
        Character c = new Character();
        c.setName("Test");
        when(repository.findByOwner_Id(5L)).thenReturn(List.of(c));

        List<Character> result = service.findByOwner(5L);

        assertEquals(1, result.size());
        assertEquals("Test", result.get(0).getName());
    }

    @Test
    void findByIdReturnsOptional() {
        Character c = new Character();
        c.setId(1L);
        c.setName("Found");
        when(repository.findById(1L)).thenReturn(Optional.of(c));
        when(repository.findById(999L)).thenReturn(Optional.empty());

        assertTrue(service.findById(1L).isPresent());
        assertTrue(service.findById(999L).isEmpty());
    }

    @Test
    void saveDelegatesToRepository() {
        Character c = new Character();
        c.setName("New");
        when(repository.save(c)).thenReturn(c);

        Character saved = service.save(c);

        assertEquals("New", saved.getName());
        verify(repository).save(c);
    }

    @Test
    void deleteByIdClearsChronicleFirst() {
        Character c = new Character();
        c.setId(1L);
        c.setName("ToDelete");
        when(repository.findById(1L)).thenReturn(Optional.of(c));

        service.deleteById(1L);

        assertNull(c.getChronicle());
        verify(repository).save(c);
        verify(repository).delete(c);
    }

    @Test
    void deleteByIdNonExistentDoesNothing() {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        service.deleteById(999L);

        verify(repository, never()).delete(any());
    }

    @Test
    void findByNameDelegatesToRepository() {
        when(repository.findByNameContainingIgnoreCase("vamp")).thenReturn(List.of());

        List<Character> result = service.findByName("vamp");

        assertTrue(result.isEmpty());
        verify(repository).findByNameContainingIgnoreCase("vamp");
    }
}
