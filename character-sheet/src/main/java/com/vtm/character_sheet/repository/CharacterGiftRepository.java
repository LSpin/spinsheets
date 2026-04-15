package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.CharacterGift;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CharacterGiftRepository extends JpaRepository<CharacterGift, Long> {
    List<CharacterGift> findByCharacterId(Long characterId);
}
