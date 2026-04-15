package com.vtm.character_sheet.controller;

import com.vtm.character_sheet.entity.InventoryItem;
import com.vtm.character_sheet.security.CharacterAccessChecker;
import com.vtm.character_sheet.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService service;
    private final CharacterAccessChecker access;

    @GetMapping("/{id}/inventory")
    public ResponseEntity<List<InventoryItem>> getItems(@PathVariable Long id) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.getItems(id));
    }

    @PostMapping("/{id}/inventory")
    public ResponseEntity<InventoryItem> addItem(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.addItem(id, body));
    }

    @DeleteMapping("/{id}/inventory/{itemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long id, @PathVariable Long itemId) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        service.removeItem(itemId);
        return ResponseEntity.noContent().build();
    }
}
