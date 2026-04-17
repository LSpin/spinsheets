package com.vtm.character_sheet.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "chronicles")
@Getter @Setter @NoArgsConstructor
public class Chronicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "storyteller_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer"})
    private AppUser storyteller;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "chronicle_assistant_storytellers",
        joinColumns = @JoinColumn(name = "chronicle_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnoreProperties({"hibernateLazyInitializer", "passwordHash"})
    private Set<AppUser> assistantStorytellers = new HashSet<>();

    @Column(unique = true, length = 8)
    private String inviteCode;

    @Column(length = 50)
    private String allowedSplats;

    @Column(length = 20)
    private String gameSystem = "WOD";

    private LocalDateTime createdAt = LocalDateTime.now();
}
