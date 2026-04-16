package com.vtm.character_sheet.security;

import com.vtm.character_sheet.entity.AppUser;
import com.vtm.character_sheet.entity.Role;
import com.vtm.character_sheet.repository.AppUserRepository;
import com.vtm.character_sheet.repository.CharacterRepository;
import com.vtm.character_sheet.repository.ChronicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CharacterAccessChecker {

    private final CharacterRepository characterRepository;
    private final ChronicleRepository chronicleRepository;
    private final AppUserRepository userRepository;

    public AppUser getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow();
    }

    public boolean isStoryteller() {
        return getCurrentUser().getRole() == Role.STORYTELLER;
    }

    public boolean canAccess(Long characterId) {
        AppUser user = getCurrentUser();
        return characterRepository.findById(characterId)
                .map(c -> {
                    // Owner can always access their own characters
                    if (c.getOwner() != null && c.getOwner().getId().equals(user.getId())) return true;
                    // Storyteller can access characters in their chronicles
                    if (user.getRole() == Role.STORYTELLER && c.getChronicle() != null) {
                        if (c.getChronicle().getStoryteller().getId().equals(user.getId())) {
                            return true;
                        }
                        // Assistant Storyteller can also access characters in their chronicles
                        if (c.getChronicle().getAssistantStorytellers().stream()
                                .anyMatch(ast -> ast.getId().equals(user.getId()))) {
                            return true;
                        }
                    }
                    return false;
                })
                .orElse(false);
    }
}
