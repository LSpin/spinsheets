package com.vtm.character_sheet.service;

import com.vtm.character_sheet.entity.Character;
import com.vtm.character_sheet.entity.InventoryItem;
import com.vtm.character_sheet.repository.InventoryItemRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock private InventoryItemRepository repository;
    @Mock private CharacterService characterService;
    @InjectMocks private InventoryService service;

    @Test
    void addItemSetsAllFields() {
        Character c = new Character();
        c.setId(1L);
        when(characterService.findById(1L)).thenReturn(Optional.of(c));
        when(repository.save(any(InventoryItem.class))).thenAnswer(inv -> inv.getArgument(0));

        Map<String, Object> body = Map.of(
                "name", "Silver Sword",
                "category", "WEAPON",
                "quantity", 1,
                "damage", "Str+2 L",
                "notes", "Cold iron"
        );

        InventoryItem item = service.addItem(1L, body);

        assertEquals("Silver Sword", item.getName());
        assertEquals("WEAPON", item.getCategory());
        assertEquals(1, item.getQuantity());
        assertEquals("Str+2 L", item.getDamage());
        assertEquals("Cold iron", item.getNotes());
        assertEquals(c, item.getCharacter());
    }

    @Test
    void addItemDefaultsToEquipment() {
        Character c = new Character();
        c.setId(1L);
        when(characterService.findById(1L)).thenReturn(Optional.of(c));
        when(repository.save(any(InventoryItem.class))).thenAnswer(inv -> inv.getArgument(0));

        InventoryItem item = service.addItem(1L, Map.of("name", "Backpack"));

        assertEquals("EQUIPMENT", item.getCategory());
    }

    @Test
    void addItemThrowsForMissingCharacter() {
        when(characterService.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> service.addItem(999L, Map.of("name", "Item")));
    }

    @Test
    void getItemsDelegatesToRepository() {
        when(repository.findByCharacterIdOrderByCategoryAscNameAsc(5L)).thenReturn(List.of());

        List<InventoryItem> result = service.getItems(5L);

        assertTrue(result.isEmpty());
        verify(repository).findByCharacterIdOrderByCategoryAscNameAsc(5L);
    }

    @Test
    void removeItemDelegatesToRepository() {
        service.removeItem(42L);
        verify(repository).deleteById(42L);
    }
}
