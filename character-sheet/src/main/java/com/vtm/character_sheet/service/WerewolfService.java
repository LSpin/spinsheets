package com.vtm.character_sheet.service;

import com.vtm.character_sheet.entity.CharacterFetish;
import com.vtm.character_sheet.entity.CharacterGift;
import com.vtm.character_sheet.entity.CharacterRite;
import com.vtm.character_sheet.repository.CharacterFetishRepository;
import com.vtm.character_sheet.repository.CharacterGiftRepository;
import com.vtm.character_sheet.repository.CharacterRepository;
import com.vtm.character_sheet.repository.CharacterRiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WerewolfService {

    private final CharacterRepository characterRepository;
    private final CharacterGiftRepository giftRepository;
    private final CharacterRiteRepository riteRepository;
    private final CharacterFetishRepository fetishRepository;

    // Gifts
    public List<CharacterGift> getGifts(Long characterId) { return giftRepository.findByCharacterId(characterId); }

    public CharacterGift addGift(Long characterId, Map<String, Object> body) {
        com.vtm.character_sheet.entity.Character c = characterRepository.findById(characterId).orElseThrow();
        CharacterGift g = new CharacterGift();
        g.setCharacter(c);
        g.setName((String) body.get("name"));
        g.setLevel(body.get("level") != null ? ((Number) body.get("level")).intValue() : 1);
        g.setNotes((String) body.get("notes"));
        return giftRepository.save(g);
    }

    public void removeGift(Long giftId) { giftRepository.deleteById(giftId); }

    // Rites
    public List<CharacterRite> getRites(Long characterId) { return riteRepository.findByCharacterId(characterId); }

    public CharacterRite addRite(Long characterId, Map<String, Object> body) {
        com.vtm.character_sheet.entity.Character c = characterRepository.findById(characterId).orElseThrow();
        CharacterRite r = new CharacterRite();
        r.setCharacter(c);
        r.setName((String) body.get("name"));
        r.setLevel(body.get("level") != null ? ((Number) body.get("level")).intValue() : 1);
        r.setNotes((String) body.get("notes"));
        return riteRepository.save(r);
    }

    public void removeRite(Long riteId) { riteRepository.deleteById(riteId); }

    // Fetishes
    public List<CharacterFetish> getFetishes(Long characterId) { return fetishRepository.findByCharacterId(characterId); }

    public CharacterFetish addFetish(Long characterId, Map<String, Object> body) {
        com.vtm.character_sheet.entity.Character c = characterRepository.findById(characterId).orElseThrow();
        CharacterFetish f = new CharacterFetish();
        f.setCharacter(c);
        f.setName((String) body.get("name"));
        f.setLevel(body.get("level") != null ? ((Number) body.get("level")).intValue() : 1);
        f.setGnosisRating(body.get("gnosisRating") != null ? ((Number) body.get("gnosisRating")).intValue() : null);
        f.setPower((String) body.get("power"));
        return fetishRepository.save(f);
    }

    public void removeFetish(Long fetishId) { fetishRepository.deleteById(fetishId); }
}
