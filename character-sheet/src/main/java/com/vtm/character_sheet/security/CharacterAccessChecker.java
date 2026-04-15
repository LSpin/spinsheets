package com.vtm.character_sheet.security;

import com.vtm.character_sheet.entity.AppUser;
import com.vtm.character_sheet.entity.Role;
import com.vtm.character_sheet.repository.AppUserRepository;
import com.vtm.character_sheet.repository.CharacterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CharacterAccessChecker {

    private final CharacterRepository characterRepository;
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
        if (user.getRole() == Role.STORYTELLER) return true;
        return characterRepository.findById(characterId)
                .map(c -> c.getOwner() != null && c.getOwner().getId().equals(user.getId()))
                .orElse(false);
    }
}
