package com.vtm.character_sheet.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "xp_log_entries")
@Getter @Setter @NoArgsConstructor
public class XpLogEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "character_id", nullable = false)
    private Character character;

    @Column(nullable = false, length = 10)
    private String type; // "XP" or "FREEBIE"

    @Column(nullable = false)
    private Integer amount; // positive = earned/gained, negative = spent

    @Column(nullable = false)
    private String category; // e.g. "Attribute", "Discipline", "Ability", "Earned", etc.

    @Column(columnDefinition = "TEXT")
    private String description; // what specifically

    private LocalDateTime createdAt = LocalDateTime.now();
}
