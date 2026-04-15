package com.vtm.character_sheet.controller;

import com.vtm.character_sheet.entity.CharacterSorceryPath;
import com.vtm.character_sheet.entity.CharacterRitual;
import com.vtm.character_sheet.security.CharacterAccessChecker;
import com.vtm.character_sheet.service.SorceryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
public class SorceryController {

    private final SorceryService service;
    private final CharacterAccessChecker access;

    @GetMapping("/{id}/sorcery-paths")
    public ResponseEntity<List<CharacterSorceryPath>> getPaths(@PathVariable Long id) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.getPaths(id));
    }

    @PostMapping("/{id}/sorcery-paths")
    public ResponseEntity<CharacterSorceryPath> addPath(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.addPath(id, body));
    }

    @DeleteMapping("/{id}/sorcery-paths/{pathId}")
    public ResponseEntity<Void> removePath(@PathVariable Long id, @PathVariable Long pathId) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        service.removePath(pathId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/rituals")
    public ResponseEntity<List<CharacterRitual>> getRituals(@PathVariable Long id) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.getRituals(id));
    }

    @PostMapping("/{id}/rituals")
    public ResponseEntity<CharacterRitual> addRitual(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.addRitual(id, body));
    }

    @DeleteMapping("/{id}/rituals/{ritualId}")
    public ResponseEntity<Void> removeRitual(@PathVariable Long id, @PathVariable Long ritualId) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        service.removeRitual(ritualId);
        return ResponseEntity.noContent().build();
    }
}
