package com.vtm.character_sheet.controller;

import com.vtm.character_sheet.entity.*;
import com.vtm.character_sheet.security.CharacterAccessChecker;
import com.vtm.character_sheet.service.WerewolfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
public class WerewolfController {

    private final WerewolfService service;
    private final CharacterAccessChecker access;

    // ── Gifts ──
    @GetMapping("/{id}/gifts")
    public ResponseEntity<List<CharacterGift>> getGifts(@PathVariable Long id) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.getGifts(id));
    }

    @PostMapping("/{id}/gifts")
    public ResponseEntity<CharacterGift> addGift(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.addGift(id, body));
    }

    @DeleteMapping("/{id}/gifts/{giftId}")
    public ResponseEntity<Void> removeGift(@PathVariable Long id, @PathVariable Long giftId) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        service.removeGift(giftId);
        return ResponseEntity.noContent().build();
    }

    // ── Rites ──
    @GetMapping("/{id}/rites")
    public ResponseEntity<List<CharacterRite>> getRites(@PathVariable Long id) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.getRites(id));
    }

    @PostMapping("/{id}/rites")
    public ResponseEntity<CharacterRite> addRite(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.addRite(id, body));
    }

    @DeleteMapping("/{id}/rites/{riteId}")
    public ResponseEntity<Void> removeRite(@PathVariable Long id, @PathVariable Long riteId) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        service.removeRite(riteId);
        return ResponseEntity.noContent().build();
    }

    // ── Fetishes ──
    @GetMapping("/{id}/fetishes")
    public ResponseEntity<List<CharacterFetish>> getFetishes(@PathVariable Long id) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.getFetishes(id));
    }

    @PostMapping("/{id}/fetishes")
    public ResponseEntity<CharacterFetish> addFetish(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.addFetish(id, body));
    }

    @DeleteMapping("/{id}/fetishes/{fetishId}")
    public ResponseEntity<Void> removeFetish(@PathVariable Long id, @PathVariable Long fetishId) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        service.removeFetish(fetishId);
        return ResponseEntity.noContent().build();
    }
}
