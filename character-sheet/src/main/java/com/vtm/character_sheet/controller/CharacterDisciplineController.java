package com.vtm.character_sheet.controller;

import com.vtm.character_sheet.entity.CharacterBackground;
import com.vtm.character_sheet.entity.CharacterDiscipline;
import com.vtm.character_sheet.security.CharacterAccessChecker;
import com.vtm.character_sheet.service.CharacterDisciplineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
public class CharacterDisciplineController {

    private final CharacterDisciplineService service;
    private final CharacterAccessChecker access;

    @GetMapping("/{id}/disciplines")
    public ResponseEntity<List<CharacterDiscipline>> getDisciplines(@PathVariable Long id) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.getDisciplines(id));
    }

    @PostMapping("/{id}/disciplines")
    public ResponseEntity<CharacterDiscipline> addDiscipline(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        String name = (String) body.get("name");
        Integer level = (Integer) body.get("level");
        return ResponseEntity.ok(service.addDiscipline(id, name, level));
    }

    @DeleteMapping("/{id}/disciplines/{disciplineId}")
    public ResponseEntity<Void> removeDiscipline(@PathVariable Long id, @PathVariable Long disciplineId) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        service.removeDiscipline(disciplineId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/backgrounds")
    public ResponseEntity<List<CharacterBackground>> getBackgrounds(@PathVariable Long id) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(service.getBackgrounds(id));
    }

    @PostMapping("/{id}/backgrounds")
    public ResponseEntity<CharacterBackground> addBackground(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        String name = (String) body.get("name");
        Integer level = (Integer) body.get("level");
        String description = (String) body.get("description");
        return ResponseEntity.ok(service.addBackground(id, name, level, description));
    }

    @DeleteMapping("/{id}/backgrounds/{backgroundId}")
    public ResponseEntity<Void> removeBackground(@PathVariable Long id, @PathVariable Long backgroundId) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        service.removeBackground(backgroundId);
        return ResponseEntity.noContent().build();
    }
}
