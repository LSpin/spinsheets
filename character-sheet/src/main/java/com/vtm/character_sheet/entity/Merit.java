package com.vtm.character_sheet.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "merits")
@Getter @Setter @NoArgsConstructor
public class Merit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private Integer cost;

    @Column(name = "cost_obs")
    private String costObs;

    private String source;

    private Integer page;

    @Column(columnDefinition = "TEXT")
    private String description;
}