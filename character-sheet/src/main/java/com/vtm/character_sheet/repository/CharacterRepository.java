package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.Character;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CharacterRepository extends JpaRepository<Character, Long> {
    List<Character> findByNameContainingIgnoreCase(String name);
    List<Character> findByClan(String clan);
    List<Character> findByOwnerId(Long ownerId);
}
