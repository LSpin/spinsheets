package com.vtm.character_sheet.controller;

import com.vtm.character_sheet.entity.CharacterFlaw;
import com.vtm.character_sheet.entity.CharacterMerit;
import com.vtm.character_sheet.security.CharacterAccessChecker;
import com.vtm.character_sheet.service.CharacterMeritService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
public class CharacterMeritController {

    private final CharacterMeritService service;
    private final CharacterAccessChecker access;

    @GetMapping("/{id}/merits")
    public ResponseEntity<List<CharacterMerit>> getMerits(@PathVariable Long id) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.getMerits(id));
    }

    @PostMapping("/{id}/merits")
    public ResponseEntity<CharacterMerit> addMerit(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.addMerit(id, body.get("meritId").longValue(), body.get("pointsSpent")));
    }

    @DeleteMapping("/{id}/merits/{meritId}")
    public ResponseEntity<Void> removeMerit(@PathVariable Long id, @PathVariable Long meritId) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        service.removeMerit(meritId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/flaws")
    public ResponseEntity<List<CharacterFlaw>> getFlaws(@PathVariable Long id) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.getFlaws(id));
    }

    @PostMapping("/{id}/flaws")
    public ResponseEntity<CharacterFlaw> addFlaw(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.addFlaw(id, body.get("flawId").longValue(), body.get("pointsGained")));
    }

    @DeleteMapping("/{id}/flaws/{flawId}")
    public ResponseEntity<Void> removeFlaw(@PathVariable Long id, @PathVariable Long flawId) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        service.removeFlaw(flawId);
        return ResponseEntity.noContent().build();
    }
}
