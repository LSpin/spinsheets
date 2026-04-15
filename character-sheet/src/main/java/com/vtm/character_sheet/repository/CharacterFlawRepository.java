package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.CharacterFlaw;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CharacterFlawRepository extends JpaRepository<CharacterFlaw, Long> {
    List<CharacterFlaw> findByCharacterId(Long characterId);
}