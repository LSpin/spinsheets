package com.vtm.character_sheet.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "chronicle_sessions")
@Getter @Setter @NoArgsConstructor
public class ChronicleSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chronicle_id", nullable = false)
    private Chronicle chronicle;

    @Column(nullable = false)
    private String title;

    private LocalDate sessionDate;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private Integer sessionNumber;
}
