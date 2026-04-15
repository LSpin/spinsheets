package com.vtm.character_sheet.controller;

import com.vtm.character_sheet.entity.AppUser;
import com.vtm.character_sheet.entity.Chronicle;
import com.vtm.character_sheet.entity.Role;
import com.vtm.character_sheet.repository.CharacterRepository;
import com.vtm.character_sheet.security.CharacterAccessChecker;
import com.vtm.character_sheet.service.ChronicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chronicles")
@RequiredArgsConstructor
public class ChronicleController {

    private final ChronicleService service;
    private final CharacterRepository characterRepository;
    private final CharacterAccessChecker access;

    @GetMapping
    public List<Chronicle> findAll() {
        AppUser user = access.getCurrentUser();
        if (user.getRole() == Role.STORYTELLER) {
            return service.findByStoryteller(user.getId());
        }
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return service.findById(id).map(chronicle -> {
            Map<String, Object> response = new HashMap<>();
            response.put("chronicle", chronicle);
            response.put("characters", characterRepository.findByChronicle_Id(id));
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Chronicle chronicle) {
        AppUser user = access.getCurrentUser();
        if (user.getRole() != Role.STORYTELLER) {
            return ResponseEntity.status(403).body(Map.of("error", "Only Storytellers can create chronicles"));
        }
        chronicle.setStoryteller(user);
        return ResponseEntity.ok(service.save(chronicle));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Chronicle updated) {
        AppUser user = access.getCurrentUser();
        return service.findById(id).map(existing -> {
            if (!existing.getStoryteller().getId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }
            existing.setName(updated.getName());
            existing.setDescription(updated.getDescription());
            return ResponseEntity.ok(service.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        AppUser user = access.getCurrentUser();
        return service.findById(id).map(chronicle -> {
            if (!chronicle.getStoryteller().getId().equals(user.getId())) {
                return ResponseEntity.status(403).<Void>build();
            }
            // Remove all characters from this chronicle
            characterRepository.findByChronicle_Id(id).forEach(c -> {
                c.setChronicle(null);
                characterRepository.save(c);
            });
            service.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
