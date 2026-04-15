package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.CharacterRite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CharacterRiteRepository extends JpaRepository<CharacterRite, Long> {
    List<CharacterRite> findByCharacterId(Long characterId);
}
