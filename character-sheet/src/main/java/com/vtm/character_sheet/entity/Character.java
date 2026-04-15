package com.vtm.character_sheet.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;
// InventoryItem imported via same package

@Entity
@Table(name = "characters")
@Getter @Setter @NoArgsConstructor
public class Character {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer"})
    private AppUser owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chronicle_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer"})
    private Chronicle chronicle;

    public Long getOwnerId() {
        return owner != null ? owner.getId() : null;
    }

    private Boolean npc = false;

    @Column(length = 20)
    private String splat = "VAMPIRE";

    // Identity
    @Column(nullable = false)
    @NotBlank(message = "Name is required")
    @Size(max = 200, message = "Name must be 200 characters or less")
    private String name;
    private String altName;
    private String concept;
    private String clan;
    private String sect;
    @Min(value = 4, message = "Generation must be between 4 and 15")
    @Max(value = 15, message = "Generation must be between 4 and 15")
    private Integer generation;
    private String nature;
    private String demeanor;
    private String domainHaven;
    private String visibleAge;
    private String totalAge;

    // Physical
    private Integer strength = 1;
    private Integer dexterity = 1;
    private Integer stamina = 1;

    // Social
    private Integer charisma = 1;
    private Integer manipulation = 1;
    private Integer appearance = 1;

    // Mental
    private Integer perception = 1;
    private Integer intelligence = 1;
    private Integer wits = 1;

    // Talents
    private Integer alertness = 0;
    private Integer athletics = 0;
    private Integer awareness = 0;
    private Integer brawl = 0;
    private Integer dodge = 0;
    private Integer empathy = 0;
    private Integer expression = 0;
    private Integer intimidation = 0;
    private Integer leadership = 0;
    private Integer streetwise = 0;
    private Integer subterfuge = 0;
    private String hobbyTalent1Name;
    private Integer hobbyTalent1 = 0;
    private String hobbyTalent2Name;
    private Integer hobbyTalent2 = 0;
    private String hobbyTalent3Name;
    private Integer hobbyTalent3 = 0;

    // Skills
    private Integer animalKen = 0;
    private Integer crafts = 0;
    private Integer drive = 0;
    private Integer etiquette = 0;
    private Integer firearms = 0;
    private Integer larceny = 0;
    private Integer melee = 0;
    private Integer performance = 0;
    private Integer security = 0;
    private Integer stealth = 0;
    private Integer survival = 0;
    private String profSkill1Name;
    private Integer profSkill1 = 0;
    private String profSkill2Name;
    private Integer profSkill2 = 0;
    private String profSkill3Name;
    private Integer profSkill3 = 0;

    // Knowledges
    private Integer academics = 0;
    private Integer computer = 0;
    private Integer finance = 0;
    private Integer investigation = 0;
    private Integer law = 0;
    private Integer linguistics = 0;
    private Integer medicine = 0;
    private Integer occult = 0;
    private Integer politics = 0;
    private Integer science = 0;
    private Integer technology = 0;
    private String expertKnowl1Name;
    private Integer expertKnowl1 = 0;
    private String expertKnowl2Name;
    private Integer expertKnowl2 = 0;
    private String expertKnowl3Name;
    private Integer expertKnowl3 = 0;

    // Specialties — Attributes
    private String strengthSpec;
    private String dexteritySpec;
    private String staminaSpec;
    private String charismaSpec;
    private String manipulationSpec;
    private String appearanceSpec;
    private String perceptionSpec;
    private String intelligenceSpec;
    private String witsSpec;

    // Specialties — Talents
    private String alertnessSpec;
    private String athleticsSpec;
    private String awarenessSpec;
    private String brawlSpec;
    private String empathySpec;
    private String expressionSpec;
    private String intimidationSpec;
    private String leadershipSpec;
    private String streetwiseSpec;
    private String subterfugeSpec;

    // Specialties — Skills
    private String animalKenSpec;
    private String craftsSpec;
    private String driveSpec;
    private String etiquetteSpec;
    private String firearmsSpec;
    private String larcenySpec;
    private String meleeSpec;
    private String performanceSpec;
    private String stealthSpec;
    private String survivalSpec;

    // Specialties — Knowledges
    private String academicsSpec;
    private String computerSpec;
    private String financeSpec;
    private String investigationSpec;
    private String lawSpec;
    private String linguisticsSpec;
    private String medicineSpec;
    private String occultSpec;
    private String politicsSpec;
    private String scienceSpec;
    private String technologySpec;

    // Virtues
    private Integer conscience = 1;
    private Integer selfControl = 1;
    private Integer courage = 1;

    // Path & Willpower
    private String pathName = "Humanity";
    private Integer pathRating = 2;
    private Integer willpower = 3;
    private Integer currentWillpower = 3;

    // Blood Pool (max derived from generation in frontend)
    private Integer currentBlood = 10;

    // Health (0=Healthy,1=Bruised,2=Hurt,3=Injured,4=Wounded,5=Mauled,6=Crippled,7=Incapacitated,8=Torpor,9=Final Death)
    private Integer woundLevel = 0;

    // Derangements & Notes
    private String derangement1;
    private String derangement2;

    @Column(columnDefinition = "TEXT")
    private String clanCurse;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @JsonIgnore
    @OneToMany(mappedBy = "character", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CharacterMerit> merits = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "character", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CharacterFlaw> flaws = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "character", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CharacterDiscipline> disciplines = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "character", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CharacterBackground> backgrounds = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "character", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InventoryItem> inventoryItems = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "character", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CharacterSorceryPath> sorceryPaths = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "character", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CharacterRitual> rituals = new ArrayList<>();
}
