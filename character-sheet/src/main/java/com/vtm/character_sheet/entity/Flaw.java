package com.vtm.character_sheet.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "flaws")
@Getter @Setter @NoArgsConstructor
public class Flaw {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private Integer bonus;

    @Column(name = "bonus_obs")
    private String bonusObs;

    private String source;

    private Integer page;

    @Column(columnDefinition = "TEXT")
    private String description;
}