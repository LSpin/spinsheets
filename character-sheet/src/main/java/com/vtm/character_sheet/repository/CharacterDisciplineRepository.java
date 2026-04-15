package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.CharacterDiscipline;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CharacterDisciplineRepository extends JpaRepository<CharacterDiscipline, Long> {
    List<CharacterDiscipline> findByCharacterId(Long characterId);
}