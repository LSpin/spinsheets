package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByCharacterIdOrderByCategoryAscNameAsc(Long characterId);
}
