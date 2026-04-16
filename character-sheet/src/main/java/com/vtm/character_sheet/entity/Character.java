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
    private String hobbyTalent4Name;
    private Integer hobbyTalent4 = 0;
    private String hobbyTalent5Name;
    private Integer hobbyTalent5 = 0;
    private String hobbyTalent6Name;
    private Integer hobbyTalent6 = 0;
    private String hobbyTalent7Name;
    private Integer hobbyTalent7 = 0;
    private String hobbyTalent8Name;
    private Integer hobbyTalent8 = 0;
    private String hobbyTalent9Name;
    private Integer hobbyTalent9 = 0;
    private String hobbyTalent10Name;
    private Integer hobbyTalent10 = 0;

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
    private String profSkill4Name;
    private Integer profSkill4 = 0;
    private String profSkill5Name;
    private Integer profSkill5 = 0;
    private String profSkill6Name;
    private Integer profSkill6 = 0;
    private String profSkill7Name;
    private Integer profSkill7 = 0;
    private String profSkill8Name;
    private Integer profSkill8 = 0;
    private String profSkill9Name;
    private Integer profSkill9 = 0;
    private String profSkill10Name;
    private Integer profSkill10 = 0;

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
    private String expertKnowl4Name;
    private Integer expertKnowl4 = 0;
    private String expertKnowl5Name;
    private Integer expertKnowl5 = 0;
    private String expertKnowl6Name;
    private Integer expertKnowl6 = 0;
    private String expertKnowl7Name;
    private Integer expertKnowl7 = 0;
    private String expertKnowl8Name;
    private Integer expertKnowl8 = 0;
    private String expertKnowl9Name;
    private Integer expertKnowl9 = 0;
    private String expertKnowl10Name;
    private Integer expertKnowl10 = 0;

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
    private String dodgeSpec;
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
    private String securitySpec;
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

    // Health track — damage type per level: null/empty = undamaged, B = bashing, L = lethal, A = aggravated
    @Column(length = 1) private String healthBruised;
    @Column(length = 1) private String healthHurt;
    @Column(length = 1) private String healthInjured;
    @Column(length = 1) private String healthWounded;
    @Column(length = 1) private String healthMauled;
    @Column(length = 1) private String healthCrippled;
    @Column(length = 1) private String healthIncap;

    // ── Dark Ages-specific abilities ──
    private Integer legerdemain = 0;
    private String legerdemainSpec;
    private Integer archery = 0;
    private String archerySpec;
    private Integer ride = 0;
    private String rideSpec;
    private Integer seneschal = 0;
    private String seneschalSpec;
    private Integer hearthWisdom = 0;
    private String hearthWisdomSpec;
    private Integer theology = 0;
    private String theologySpec;

    // ── Werewolf-specific fields ──

    // W20 Identity
    private String breed;
    private String auspice;
    private String tribe;
    private String packName;
    private String packTotem;
    private String rank;

    // W20 Abilities (unique to Garou)
    private Integer primalUrge = 0;
    private String primalUrgeSpec;
    private Integer enigmas = 0;
    private String enigmasSpec;
    private Integer ritualAbility = 0;
    private String ritualAbilitySpec;

    // W20 Rage / Gnosis
    private Integer rage = 1;
    private Integer currentRage = 1;
    private Integer gnosis = 1;
    private Integer currentGnosis = 1;

    // W20 Renown
    private Integer glory = 0;
    private Integer currentGlory = 0;
    private Integer honor = 0;
    private Integer currentHonor = 0;
    private Integer wisdomRenown = 0;
    private Integer currentWisdomRenown = 0;

    // W20 Sept
    private String septName;
    private String caernLocation;
    private String caernType;
    private String septTotem;
    private String septLeader;

    // ── Mage-specific fields ──

    // M20 Identity
    private String essence;
    private String affiliation;
    private String mageSection;

    // M20 Abilities (unique to Mages)
    private Integer art = 0;
    private String artSpec;
    private Integer martialArts = 0;
    private String martialArtsSpec;
    private Integer meditation = 0;
    private String meditationSpec;
    private Integer research = 0;
    private String researchSpec;
    private Integer cosmology = 0;
    private String cosmologySpec;
    private Integer esoterica = 0;
    private String esotericaSpec;

    // M20 Spheres
    private Integer sphereCorrespondence = 0;
    private Integer sphereEntropy = 0;
    private Integer sphereForces = 0;
    private Integer sphereLife = 0;
    private Integer sphereMatter = 0;
    private Integer sphereMind = 0;
    private Integer spherePrime = 0;
    private Integer sphereSpirit = 0;
    private Integer sphereTime = 0;

    // M20 Arete, Quintessence, Paradox
    private Integer arete = 1;
    private Integer quintessence = 0;
    private Integer paradox = 0;

    // M20 Focus
    @Column(columnDefinition = "TEXT")
    private String paradigm;
    @Column(columnDefinition = "TEXT")
    private String practice;
    @Column(columnDefinition = "TEXT")
    private String instruments;

    // M20 Chantry
    private String chantryName;
    @Column(columnDefinition = "TEXT")
    private String chantryDescription;

    // ── Kindred of the East (KotE) fields ──

    // KotE Identity
    private String poNature;
    private String balance;
    private String direction;
    private String wu;

    // KotE Dharma
    private String dharmaName;
    private Integer dharmaRating = 0;

    // KotE Soul
    private Integer hun = 0;
    private Integer po = 0;

    // KotE Chi
    private Integer yinChi = 0;
    private Integer yangChi = 0;
    private Integer demonChi = 0;

    @Column(columnDefinition = "TEXT")
    private String imbalance;

    // ── Shared fields ──

    // Derangements & Notes
    private String derangement1;
    private String derangement2;

    @Column(columnDefinition = "TEXT")
    private String clanCurse;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(columnDefinition = "TEXT")
    private String backstory;

    @Column(columnDefinition = "TEXT")
    private String appearanceDesc;

    @Column(columnDefinition = "TEXT")
    private String goals;

    @Column(columnDefinition = "TEXT")
    private String allies;

    @Column(columnDefinition = "TEXT")
    private String enemies;

    @Column(columnDefinition = "TEXT")
    private String havens;

    @Column(columnDefinition = "TEXT")
    private String territories;

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
    private List<ComboDiscipline> comboDisciplines = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "character", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CharacterRote> rotes = new ArrayList<>();

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

    // W20 sub-entities
    @JsonIgnore
    @OneToMany(mappedBy = "character", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CharacterGift> gifts = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "character", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CharacterRite> rites = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "character", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CharacterFetish> fetishes = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "character", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<XpLogEntry> xpLogEntries = new ArrayList<>();
}
