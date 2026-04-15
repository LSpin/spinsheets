package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.Chronicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChronicleRepository extends JpaRepository<Chronicle, Long> {
    List<Chronicle> findByStoryteller_Id(Long storytellerId);
}
