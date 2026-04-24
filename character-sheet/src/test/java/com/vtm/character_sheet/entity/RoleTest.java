package com.vtm.character_sheet.entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RoleTest {

    @Test
    void hasThreeValues() {
        assertEquals(3, Role.values().length);
    }

    @Test
    void containsPlayerStorytellerAdmin() {
        assertNotNull(Role.valueOf("PLAYER"));
        assertNotNull(Role.valueOf("STORYTELLER"));
        assertNotNull(Role.valueOf("ADMIN"));
    }
}
