package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.CharacterBackground;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CharacterBackgroundRepository extends JpaRepository<CharacterBackground, Long> {
    List<CharacterBackground> findByCharacterId(Long characterId);
}