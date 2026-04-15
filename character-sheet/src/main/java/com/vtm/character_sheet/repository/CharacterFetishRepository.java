package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.CharacterFetish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CharacterFetishRepository extends JpaRepository<CharacterFetish, Long> {
    List<CharacterFetish> findByCharacterId(Long characterId);
}
