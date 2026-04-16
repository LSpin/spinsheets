package com.vtm.character_sheet.controller;

import com.vtm.character_sheet.entity.XpLogEntry;
import com.vtm.character_sheet.repository.XpLogEntryRepository;
import com.vtm.character_sheet.security.CharacterAccessChecker;
import com.vtm.character_sheet.service.CharacterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
public class XpLogController {

    private final XpLogEntryRepository repository;
    private final CharacterService characterService;
    private final CharacterAccessChecker access;

    @GetMapping("/{id}/xp-log")
    public ResponseEntity<List<XpLogEntry>> getXpLog(@PathVariable Long id) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(repository.findByCharacterIdOrderByCreatedAtDesc(id));
    }

    @PostMapping("/{id}/xp-log")
    public ResponseEntity<XpLogEntry> addXpLogEntry(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return characterService.findById(id).map(character -> {
            XpLogEntry entry = new XpLogEntry();
            entry.setCharacter(character);
            entry.setType((String) body.get("type"));
            entry.setAmount((Integer) body.get("amount"));
            entry.setCategory((String) body.get("category"));
            entry.setDescription((String) body.get("description"));
            return ResponseEntity.ok(repository.save(entry));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/xp-log/{entryId}")
    public ResponseEntity<Void> removeXpLogEntry(@PathVariable Long id, @PathVariable Long entryId) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        repository.deleteById(entryId);
        return ResponseEntity.noContent().build();
    }
}
