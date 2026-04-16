package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.ComboDiscipline;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComboDisciplineRepository extends JpaRepository<ComboDiscipline, Long> {
    List<ComboDiscipline> findByCharacterId(Long characterId);
}
