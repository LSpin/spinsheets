package com.vtm.character_sheet.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inventory_items")
@Getter @Setter @NoArgsConstructor
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "character_id", nullable = false)
    private Character character;

    @Column(nullable = false)
    private String name;

    private String category = "EQUIPMENT"; // WEAPON, ARMOR, VEHICLE, EQUIPMENT, OTHER

    private Integer quantity = 1;

    // ── Weapon fields ─────────────────────────────────────────────────────────
    private String damage;       // e.g. "Str+1 L" / "4L"
    private String range;        // e.g. "15m" (weapons) / "200 km/h" (vehicles)
    private String rate;         // e.g. "3" / "3/15" (burst)
    private String clip;         // e.g. "17+1"
    private String concealment;  // P / J / T / N

    // ── Armor / Vehicle fields ────────────────────────────────────────────────
    private Integer armorRating; // armor protection dice
    private Integer handling;    // maneuver rating (vehicles) / penalty (armor, negative stored as negative)
    private Integer structure;   // structural integrity (vehicles)

    @Column(columnDefinition = "TEXT")
    private String notes;
}
