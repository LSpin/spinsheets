package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.CharacterMerit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CharacterMeritRepository extends JpaRepository<CharacterMerit, Long> {
    List<CharacterMerit> findByCharacterId(Long characterId);
}