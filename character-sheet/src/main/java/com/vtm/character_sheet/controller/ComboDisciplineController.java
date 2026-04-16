package com.vtm.character_sheet.controller;

import com.vtm.character_sheet.entity.ComboDiscipline;
import com.vtm.character_sheet.repository.ComboDisciplineRepository;
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
public class ComboDisciplineController {

    private final ComboDisciplineRepository repository;
    private final CharacterService characterService;
    private final CharacterAccessChecker access;

    @GetMapping("/{id}/combo-disciplines")
    public ResponseEntity<List<ComboDiscipline>> getAll(@PathVariable Long id) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(repository.findByCharacterId(id));
    }

    @PostMapping("/{id}/combo-disciplines")
    public ResponseEntity<ComboDiscipline> add(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return characterService.findById(id).map(character -> {
            ComboDiscipline cd = new ComboDiscipline();
            cd.setCharacter(character);
            cd.setName((String) body.get("name"));
            cd.setPrerequisites((String) body.get("prerequisites"));
            cd.setDescription((String) body.get("description"));
            cd.setXpCost(body.get("xpCost") != null ? ((Number) body.get("xpCost")).intValue() : null);
            return ResponseEntity.ok(repository.save(cd));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/combo-disciplines/{comboId}")
    public ResponseEntity<Void> remove(@PathVariable Long id, @PathVariable Long comboId) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        repository.deleteById(comboId);
        return ResponseEntity.noContent().build();
    }
}
