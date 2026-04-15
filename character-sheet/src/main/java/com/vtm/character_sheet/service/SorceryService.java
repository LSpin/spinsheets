package com.vtm.character_sheet.service;

import com.vtm.character_sheet.entity.Character;
import com.vtm.character_sheet.entity.CharacterSorceryPath;
import com.vtm.character_sheet.entity.CharacterRitual;
import com.vtm.character_sheet.repository.CharacterSorceryPathRepository;
import com.vtm.character_sheet.repository.CharacterRitualRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SorceryService {

    private final CharacterSorceryPathRepository pathRepository;
    private final CharacterRitualRepository ritualRepository;
    private final CharacterService characterService;

    // ── Paths ────────────────────────────────────────────────────────────────

    public List<CharacterSorceryPath> getPaths(Long characterId) {
        return pathRepository.findByCharacterId(characterId);
    }

    public CharacterSorceryPath addPath(Long characterId, Map<String, Object> body) {
        Character character = characterService.findById(characterId)
                .orElseThrow(() -> new RuntimeException("Character not found"));
        CharacterSorceryPath path = new CharacterSorceryPath();
        path.setCharacter(character);
        path.setName((String) body.get("name"));
        path.setLevel(body.get("level") instanceof Integer l ? l : 1);
        return pathRepository.save(path);
    }

    public void removePath(Long pathId) {
        pathRepository.deleteById(pathId);
    }

    // ── Rituals ──────────────────────────────────────────────────────────────

    public List<CharacterRitual> getRituals(Long characterId) {
        return ritualRepository.findByCharacterIdOrderByLevelAscNameAsc(characterId);
    }

    public CharacterRitual addRitual(Long characterId, Map<String, Object> body) {
        Character character = characterService.findById(characterId)
                .orElseThrow(() -> new RuntimeException("Character not found"));
        CharacterRitual ritual = new CharacterRitual();
        ritual.setCharacter(character);
        ritual.setName((String) body.get("name"));
        ritual.setLevel(body.get("level") instanceof Integer l ? l : 1);
        ritual.setNotes((String) body.get("notes"));
        return ritualRepository.save(ritual);
    }

    public void removeRitual(Long ritualId) {
        ritualRepository.deleteById(ritualId);
    }
}
