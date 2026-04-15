package com.vtm.character_sheet.service;

import com.vtm.character_sheet.entity.Character;
import com.vtm.character_sheet.entity.InventoryItem;
import com.vtm.character_sheet.repository.InventoryItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryItemRepository repository;
    private final CharacterService characterService;

    public List<InventoryItem> getItems(Long characterId) {
        return repository.findByCharacterIdOrderByCategoryAscNameAsc(characterId);
    }

    public InventoryItem addItem(Long characterId, Map<String, Object> body) {
        Character character = characterService.findById(characterId)
                .orElseThrow(() -> new RuntimeException("Character not found"));
        InventoryItem item = new InventoryItem();
        item.setCharacter(character);
        item.setName((String) body.getOrDefault("name", ""));
        item.setCategory((String) body.getOrDefault("category", "EQUIPMENT"));
        item.setQuantity(body.get("quantity") instanceof Integer q ? q : 1);
        item.setDamage((String) body.get("damage"));
        item.setRange((String) body.get("range"));
        item.setRate((String) body.get("rate"));
        item.setClip((String) body.get("clip"));
        item.setConcealment((String) body.get("concealment"));
        item.setArmorRating(toInt(body.get("armorRating")));
        item.setHandling(toInt(body.get("handling")));
        item.setStructure(toInt(body.get("structure")));
        item.setNotes((String) body.get("notes"));
        return repository.save(item);
    }

    public void removeItem(Long itemId) {
        repository.deleteById(itemId);
    }

    private Integer toInt(Object val) {
        if (val instanceof Integer i) return i;
        if (val instanceof String s && !s.isBlank()) {
            try { return Integer.parseInt(s.trim()); } catch (NumberFormatException ignored) {}
        }
        return null;
    }
}
