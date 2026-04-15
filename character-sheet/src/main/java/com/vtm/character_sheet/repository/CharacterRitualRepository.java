package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.CharacterRitual;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CharacterRitualRepository extends JpaRepository<CharacterRitual, Long> {
    List<CharacterRitual> findByCharacterIdOrderByLevelAscNameAsc(Long characterId);
}
