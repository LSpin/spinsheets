package com.vtm.character_sheet.repository;

import com.vtm.character_sheet.entity.XpLogEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface XpLogEntryRepository extends JpaRepository<XpLogEntry, Long> {
    List<XpLogEntry> findByCharacterIdOrderByCreatedAtDesc(Long characterId);
    List<XpLogEntry> findByCharacterIdAndTypeOrderByCreatedAtDesc(Long characterId, String type);
}
