package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.CharacterRote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CharacterRoteRepository extends JpaRepository<CharacterRote, Long> {
    List<CharacterRote> findByCharacterId(Long characterId);
}
