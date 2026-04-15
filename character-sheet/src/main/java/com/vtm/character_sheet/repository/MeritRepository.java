package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.Merit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MeritRepository extends JpaRepository<Merit, Long> {
    List<Merit> findByNameContainingIgnoreCase(String name);
    List<Merit> findByCost(Integer cost);
    List<Merit> findByCostLessThanEqual(Integer maxCost);
    boolean existsByNameIgnoreCase(String name);
}