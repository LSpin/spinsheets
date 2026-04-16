package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.ChronicleSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChronicleSessionRepository extends JpaRepository<ChronicleSession, Long> {
    List<ChronicleSession> findByChronicleIdOrderBySessionNumberDesc(Long chronicleId);
}
