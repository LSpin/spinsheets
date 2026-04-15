package com.vtm.character_sheet.service;

import com.vtm.character_sheet.entity.Character;
import com.vtm.character_sheet.entity.CharacterFlaw;
import com.vtm.character_sheet.entity.CharacterMerit;
import com.vtm.character_sheet.entity.Merit;
import com.vtm.character_sheet.entity.Flaw;
import com.vtm.character_sheet.repository.CharacterFlawRepository;
import com.vtm.character_sheet.repository.CharacterMeritRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CharacterMeritService {

    private final CharacterMeritRepository meritRepository;
    private final CharacterFlawRepository flawRepository;
    private final CharacterService characterService;
    private final MeritService meritService;
    private final FlawService flawService;

    public CharacterMerit addMerit(Long characterId, Long meritId, Integer pointsSpent) {
        Character character = characterService.findById(characterId)
                .orElseThrow(() -> new RuntimeException("Character not found"));
        Merit merit = meritService.findById(meritId)
                .orElseThrow(() -> new RuntimeException("Merit not found"));

        CharacterMerit cm = new CharacterMerit();
        cm.setCharacter(character);
        cm.setMerit(merit);
        cm.setPointsSpent(pointsSpent);
        return meritRepository.save(cm);
    }

    public CharacterFlaw addFlaw(Long characterId, Long flawId, Integer pointsGained) {
        Character character = characterService.findById(characterId)
                .orElseThrow(() -> new RuntimeException("Character not found"));
        Flaw flaw = flawService.findById(flawId)
                .orElseThrow(() -> new RuntimeException("Flaw not found"));

        CharacterFlaw cf = new CharacterFlaw();
        cf.setCharacter(character);
        cf.setFlaw(flaw);
        cf.setPointsGained(pointsGained);
        return flawRepository.save(cf);
    }

    public List<CharacterMerit> getMerits(Long characterId) {
        return meritRepository.findByCharacterId(characterId);
    }

    public List<CharacterFlaw> getFlaws(Long characterId) {
        return flawRepository.findByCharacterId(characterId);
    }

    public void removeMerit(Long characterMeritId) {
        meritRepository.deleteById(characterMeritId);
    }

    public void removeFlaw(Long characterFlawId) {
        flawRepository.deleteById(characterFlawId);
    }
}