package com.vtm.character_sheet.service;

import com.vtm.character_sheet.entity.Chronicle;
import com.vtm.character_sheet.repository.ChronicleRepository;
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
class ChronicleServiceTest {

    @Mock private ChronicleRepository repository;
    @InjectMocks private ChronicleService service;

    @Test
    void findAllDelegatesToRepository() {
        Chronicle c = new Chronicle();
        c.setName("Dark Ages");
        when(repository.findAll()).thenReturn(List.of(c));

        List<Chronicle> result = service.findAll();
        assertEquals(1, result.size());
        assertEquals("Dark Ages", result.get(0).getName());
    }

    @Test
    void findByStoryteller() {
        when(repository.findByStoryteller_Id(5L)).thenReturn(List.of());
        assertTrue(service.findByStoryteller(5L).isEmpty());
    }

    @Test
    void findByIdReturnsOptional() {
        Chronicle c = new Chronicle();
        c.setId(1L);
        when(repository.findById(1L)).thenReturn(Optional.of(c));
        when(repository.findById(999L)).thenReturn(Optional.empty());

        assertTrue(service.findById(1L).isPresent());
        assertTrue(service.findById(999L).isEmpty());
    }

    @Test
    void saveDelegatesToRepository() {
        Chronicle c = new Chronicle();
        c.setName("New Chronicle");
        when(repository.save(c)).thenReturn(c);

        assertEquals("New Chronicle", service.save(c).getName());
        verify(repository).save(c);
    }

    @Test
    void deleteByIdDelegatesToRepository() {
        service.deleteById(1L);
        verify(repository).deleteById(1L);
    }
}
