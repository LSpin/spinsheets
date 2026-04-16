package com.vtm.character_sheet.controller;

import com.vtm.character_sheet.entity.CharacterRote;
import com.vtm.character_sheet.repository.CharacterRoteRepository;
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
public class RoteController {

    private final CharacterRoteRepository repository;
    private final CharacterService characterService;
    private final CharacterAccessChecker access;

    @GetMapping("/{id}/rotes")
    public ResponseEntity<List<CharacterRote>> getAll(@PathVariable Long id) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(repository.findByCharacterId(id));
    }

    @PostMapping("/{id}/rotes")
    public ResponseEntity<CharacterRote> add(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return characterService.findById(id).map(character -> {
            CharacterRote r = new CharacterRote();
            r.setCharacter(character);
            r.setName((String) body.get("name"));
            r.setSpheres((String) body.get("spheres"));
            r.setLevel(body.get("level") != null ? ((Number) body.get("level")).intValue() : 1);
            r.setDescription((String) body.get("description"));
            return ResponseEntity.ok(repository.save(r));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/rotes/{roteId}")
    public ResponseEntity<Void> remove(@PathVariable Long id, @PathVariable Long roteId) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        repository.deleteById(roteId);
        return ResponseEntity.noContent().build();
    }
}
