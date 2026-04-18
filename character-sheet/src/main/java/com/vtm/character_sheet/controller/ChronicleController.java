package com.vtm.character_sheet.controller;

import com.vtm.character_sheet.entity.AppUser;
import com.vtm.character_sheet.entity.Chronicle;
import com.vtm.character_sheet.entity.ChronicleSession;
import com.vtm.character_sheet.entity.Role;
import com.vtm.character_sheet.repository.AppUserRepository;
import com.vtm.character_sheet.repository.CharacterRepository;
import com.vtm.character_sheet.repository.ChronicleRepository;
import com.vtm.character_sheet.repository.ChronicleSessionRepository;
import com.vtm.character_sheet.security.CharacterAccessChecker;
import com.vtm.character_sheet.service.ChronicleService;
import com.vtm.character_sheet.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chronicles")
@RequiredArgsConstructor
public class ChronicleController {

    private final ChronicleService service;
    private final CharacterRepository characterRepository;
    private final ChronicleRepository chronicleRepository;
    private final ChronicleSessionRepository sessionRepository;
    private final AppUserRepository appUserRepository;
    private final CharacterAccessChecker access;
    private final NotificationService notificationService;

    @GetMapping
    public List<Chronicle> findAll() {
        AppUser user = access.getCurrentUser();
        if (user.getRole() == Role.STORYTELLER) {
            List<Chronicle> owned = service.findByStoryteller(user.getId());
            List<Chronicle> assisting = chronicleRepository.findByAssistantStorytellers_Id(user.getId());
            Set<Long> seen = owned.stream().map(Chronicle::getId).collect(Collectors.toSet());
            List<Chronicle> merged = new ArrayList<>(owned);
            for (Chronicle c : assisting) {
                if (seen.add(c.getId())) merged.add(c);
            }
            return merged;
        }
        // Players see all chronicles, but AST chronicles will show their AST status
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return service.findById(id).map(chronicle -> {
            Map<String, Object> response = new HashMap<>();
            response.put("chronicle", chronicle);
            response.put("characters", characterRepository.findByChronicle_Id(id));
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Chronicle chronicle) {
        AppUser user = access.getCurrentUser();
        if (user.getRole() != Role.STORYTELLER) {
            return ResponseEntity.status(403).body(Map.of("error", "Only Storytellers can create chronicles"));
        }
        chronicle.setStoryteller(user);
        return ResponseEntity.ok(service.save(chronicle));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Chronicle updated) {
        AppUser user = access.getCurrentUser();
        return service.findById(id).map(existing -> {
            if (!existing.getStoryteller().getId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }
            existing.setName(updated.getName());
            existing.setDescription(updated.getDescription());
            existing.setAllowedSplats(updated.getAllowedSplats());
            return ResponseEntity.ok(service.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        AppUser user = access.getCurrentUser();
        return service.findById(id).map(chronicle -> {
            if (!chronicle.getStoryteller().getId().equals(user.getId())) {
                return ResponseEntity.status(403).<Void>build();
            }
            // Remove all characters from this chronicle
            characterRepository.findByChronicle_Id(id).forEach(c -> {
                c.setChronicle(null);
                characterRepository.save(c);
            });
            service.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/assistants")
    public ResponseEntity<?> addAssistant(@PathVariable Long id, @RequestBody Map<String, String> body) {
        AppUser user = access.getCurrentUser();
        return service.findById(id).map(chronicle -> {
            if (!chronicle.getStoryteller().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body(Map.of("error", "Only the chronicle storyteller can add assistants"));
            }
            String username = body.get("username");
            return appUserRepository.findByUsername(username)
                    .<ResponseEntity<?>>map(assistant -> {
                        chronicle.getAssistantStorytellers().add(assistant);
                        return ResponseEntity.ok(service.save(chronicle));
                    })
                    .orElse(ResponseEntity.badRequest().body(Map.of("error", "User not found")));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/assistants/{userId}")
    public ResponseEntity<Void> removeAssistant(@PathVariable Long id, @PathVariable Long userId) {
        AppUser user = access.getCurrentUser();
        return service.findById(id).map(chronicle -> {
            if (!chronicle.getStoryteller().getId().equals(user.getId())) {
                return ResponseEntity.status(403).<Void>build();
            }
            chronicle.getAssistantStorytellers().removeIf(ast -> ast.getId().equals(userId));
            service.save(chronicle);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── Allowed Splats ──

    @PutMapping("/{id}/allowed-splats")
    public ResponseEntity<?> updateAllowedSplats(@PathVariable Long id, @RequestBody Map<String, String> body) {
        AppUser user = access.getCurrentUser();
        return service.findById(id).map(chronicle -> {
            if (!chronicle.getStoryteller().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body((Object) Map.of("error", "Only the chronicle owner can change allowed types"));
            }
            chronicle.setAllowedSplats(body.get("allowedSplats"));
            service.save(chronicle);
            return ResponseEntity.ok((Object) Map.of("allowedSplats", chronicle.getAllowedSplats()));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── Invite Code ──

    @GetMapping("/invite/{code}")
    public ResponseEntity<?> getInviteInfo(@PathVariable String code) {
        return chronicleRepository.findByInviteCode(code.trim().toUpperCase())
                .<ResponseEntity<?>>map(chronicle -> {
                    Map<String, Object> info = new HashMap<>();
                    info.put("chronicleId", chronicle.getId());
                    info.put("chronicleName", chronicle.getName());
                    info.put("storyteller", chronicle.getStoryteller().getUsername());
                    info.put("allowedSplats", chronicle.getAllowedSplats());
                    info.put("gameSystem", chronicle.getGameSystem());
                    return ResponseEntity.ok(info);
                })
                .orElse(ResponseEntity.badRequest().body(Map.of("error", "Invalid invite link")));
    }

    @PostMapping("/{id}/invite-code")
    public ResponseEntity<?> generateInviteCode(@PathVariable Long id) {
        AppUser user = access.getCurrentUser();
        return service.findById(id).map(chronicle -> {
            if (!chronicle.getStoryteller().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body((Object) Map.of("error", "Only the chronicle owner can manage invite codes"));
            }
            String code = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            chronicle.setInviteCode(code);
            service.save(chronicle);
            return ResponseEntity.ok((Object) Map.of("inviteCode", code));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/invite-code")
    public ResponseEntity<?> disableInviteCode(@PathVariable Long id) {
        AppUser user = access.getCurrentUser();
        return service.findById(id).map(chronicle -> {
            if (!chronicle.getStoryteller().getId().equals(user.getId())) {
                return ResponseEntity.status(403).<Object>body(Map.of("error", "Only the chronicle owner can manage invite codes"));
            }
            chronicle.setInviteCode(null);
            service.save(chronicle);
            return ResponseEntity.ok((Object) Map.of("message", "Invite code disabled"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinByInviteCode(@RequestBody Map<String, Object> body) {
        String code = (String) body.get("code");
        Number charIdNum = (Number) body.get("characterId");
        if (code == null || charIdNum == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Code and characterId are required"));
        }
        Long characterId = charIdNum.longValue();

        Optional<Chronicle> opt = chronicleRepository.findByInviteCode(code.trim().toUpperCase());
        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid invite code"));
        }

        Chronicle chronicle = opt.get();
        return characterRepository.findById(characterId).map(character -> {
            AppUser user = access.getCurrentUser();
            if (!character.getOwner().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body((Object) Map.of("error", "You can only add your own characters"));
            }
            if (!isSplatAllowed(chronicle, character.getSplat())) {
                return ResponseEntity.badRequest().body((Object) Map.of("error", "This character type is not allowed in this chronicle"));
            }
            character.setChronicle(chronicle);
            characterRepository.save(character);
            notificationService.notifyChronicleJoin(chronicle, user, character);
            return ResponseEntity.ok((Object) Map.of("message", "Joined chronicle", "chronicleId", chronicle.getId()));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── Sessions ──

    @GetMapping("/{id}/sessions")
    public ResponseEntity<?> getSessions(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(sessionRepository.findByChronicleIdOrderBySessionNumberDesc(id));
    }

    @PostMapping("/{id}/sessions")
    public ResponseEntity<?> addSession(@PathVariable Long id, @RequestBody ChronicleSession session) {
        AppUser user = access.getCurrentUser();
        return service.findById(id).map(chronicle -> {
            boolean isOwner = chronicle.getStoryteller().getId().equals(user.getId());
            boolean isAST = chronicle.getAssistantStorytellers().stream().anyMatch(a -> a.getId().equals(user.getId()));
            if (!isOwner && !isAST) {
                return ResponseEntity.status(403).body((Object) Map.of("error", "Only storytellers can manage sessions"));
            }
            session.setChronicle(chronicle);
            return ResponseEntity.ok((Object) sessionRepository.save(session));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/sessions/{sessionId}")
    public ResponseEntity<?> updateSession(@PathVariable Long id, @PathVariable Long sessionId, @RequestBody ChronicleSession updated) {
        AppUser user = access.getCurrentUser();
        return service.findById(id).map(chronicle -> {
            boolean isOwner = chronicle.getStoryteller().getId().equals(user.getId());
            boolean isAST = chronicle.getAssistantStorytellers().stream().anyMatch(a -> a.getId().equals(user.getId()));
            if (!isOwner && !isAST) {
                return ResponseEntity.status(403).body((Object) Map.of("error", "Only storytellers can manage sessions"));
            }
            return sessionRepository.findById(sessionId).map(existing -> {
                if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
                if (updated.getSessionDate() != null) existing.setSessionDate(updated.getSessionDate());
                if (updated.getSummary() != null) existing.setSummary(updated.getSummary());
                if (updated.getNotes() != null) existing.setNotes(updated.getNotes());
                if (updated.getSessionNumber() != null) existing.setSessionNumber(updated.getSessionNumber());
                return ResponseEntity.ok((Object) sessionRepository.save(existing));
            }).orElse(ResponseEntity.notFound().build());
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/sessions/{sessionId}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id, @PathVariable Long sessionId) {
        AppUser user = access.getCurrentUser();
        return service.findById(id).map(chronicle -> {
            boolean isOwner = chronicle.getStoryteller().getId().equals(user.getId());
            boolean isAST = chronicle.getAssistantStorytellers().stream().anyMatch(a -> a.getId().equals(user.getId()));
            if (!isOwner && !isAST) {
                return ResponseEntity.status(403).<Void>build();
            }
            sessionRepository.deleteById(sessionId);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── Helpers ──

    private static final Map<String, String> SPLAT_CATEGORY = Map.ofEntries(
        Map.entry("VAMPIRE", "VAMPIRE"), Map.entry("VAMPIRE_REVISED", "VAMPIRE"),
        Map.entry("VAMPIRE_DARK_AGES", "VAMPIRE"), Map.entry("VICTORIAN_VAMPIRE", "VAMPIRE"),
        Map.entry("KOTE", "VAMPIRE"), Map.entry("GHOUL", "VAMPIRE"),
        Map.entry("WEREWOLF", "WEREWOLF"), Map.entry("WYLD_WEST_WEREWOLF", "WEREWOLF"),
        Map.entry("CHANGING_BREEDS", "WEREWOLF"), Map.entry("TOTEM", "WEREWOLF"), Map.entry("KINFOLK", "WEREWOLF"),
        Map.entry("MAGE", "MAGE"), Map.entry("VICTORIAN_MAGE", "MAGE"),
        Map.entry("FAMILIAR", "MAGE"),
        Map.entry("SEVENTH_SEA", "SEVENTH_SEA"),
        Map.entry("L5R", "L5R"),
        Map.entry("BLADES", "BLADES"), Map.entry("BLADES_CREW", "BLADES"),
        Map.entry("DND", "DND"), Map.entry("DND_MONSTER", "DND"),
        Map.entry("UESTRPG", "UESTRPG"), Map.entry("UESTRPG_ANTAGONIST", "UESTRPG"),
        Map.entry("L5R_ANTAGONIST", "L5R"), Map.entry("BLADES_ANTAGONIST", "BLADES")
    );

    private static final Map<String, String> SYSTEM_FOR_CATEGORY = Map.of(
        "VAMPIRE", "WOD", "WEREWOLF", "WOD", "MAGE", "WOD",
        "SEVENTH_SEA", "SEVENTH_SEA", "L5R", "L5R",
        "BLADES", "BLADES", "DND", "DND",
        "UESTRPG", "UESTRPG"
    );

    private boolean isSplatAllowed(Chronicle chronicle, String splat) {
        String category = SPLAT_CATEGORY.getOrDefault(splat, splat);
        // Enforce game system match: character's category must belong to the chronicle's system
        String chronicleSystem = chronicle.getGameSystem() != null ? chronicle.getGameSystem() : "WOD";
        String charSystem = SYSTEM_FOR_CATEGORY.getOrDefault(category, category);
        if (!chronicleSystem.equals(charSystem)) return false;
        // Then check allowed sub-categories within the system
        String allowed = chronicle.getAllowedSplats();
        if (allowed == null || allowed.isBlank()) return true;
        return Arrays.asList(allowed.split(",")).contains(category);
    }
}
