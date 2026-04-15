package com.vtm.character_sheet.service;

import com.vtm.character_sheet.entity.Character;
import com.vtm.character_sheet.entity.CharacterDiscipline;
import com.vtm.character_sheet.entity.CharacterBackground;
import com.vtm.character_sheet.repository.CharacterDisciplineRepository;
import com.vtm.character_sheet.repository.CharacterBackgroundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CharacterDisciplineService {

    private final CharacterDisciplineRepository disciplineRepository;
    private final CharacterBackgroundRepository backgroundRepository;
    private final CharacterService characterService;

    public CharacterDiscipline addDiscipline(Long characterId, String name, Integer level) {
        Character character = characterService.findById(characterId)
                .orElseThrow(() -> new RuntimeException("Character not found"));
        CharacterDiscipline d = new CharacterDiscipline();
        d.setCharacter(character);
        d.setName(name);
        d.setLevel(level);
        return disciplineRepository.save(d);
    }

    public List<CharacterDiscipline> getDisciplines(Long characterId) {
        return disciplineRepository.findByCharacterId(characterId);
    }

    public void removeDiscipline(Long disciplineId) {
        disciplineRepository.deleteById(disciplineId);
    }

    public CharacterBackground addBackground(Long characterId, String name, Integer level, String description) {
        Character character = characterService.findById(characterId)
                .orElseThrow(() -> new RuntimeException("Character not found"));
        CharacterBackground b = new CharacterBackground();
        b.setCharacter(character);
        b.setName(name);
        b.setLevel(level);
        b.setDescription(description);
        return backgroundRepository.save(b);
    }

    public List<CharacterBackground> getBackgrounds(Long characterId) {
        return backgroundRepository.findByCharacterId(characterId);
    }

    public void removeBackground(Long backgroundId) {
        backgroundRepository.deleteById(backgroundId);
    }
}