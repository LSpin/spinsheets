package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.Character;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CharacterRepository extends JpaRepository<Character, Long> {
    List<Character> findByNameContainingIgnoreCase(String name);
    List<Character> findByClan(String clan);
    List<Character> findByOwner_Id(Long ownerId);
    Page<Character> findByOwner_Id(Long ownerId, Pageable pageable);
    List<Character> findByChronicle_Id(Long chronicleId);

    @Query("SELECT c FROM Character c WHERE c.chronicle.storyteller.id = :storytellerId")
    List<Character> findByChronicleStorytellerId(@Param("storytellerId") Long storytellerId);
}
