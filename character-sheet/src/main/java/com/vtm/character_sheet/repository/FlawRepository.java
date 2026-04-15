package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.Flaw;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlawRepository extends JpaRepository<Flaw, Long> {
    List<Flaw> findByNameContainingIgnoreCase(String name);
    List<Flaw> findByBonus(Integer bonus);
    boolean existsByNameIgnoreCase(String name);
}