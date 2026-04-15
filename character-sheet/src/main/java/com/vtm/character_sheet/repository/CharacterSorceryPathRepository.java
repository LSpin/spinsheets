package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.CharacterSorceryPath;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CharacterSorceryPathRepository extends JpaRepository<CharacterSorceryPath, Long> {
    List<CharacterSorceryPath> findByCharacterId(Long characterId);
}
