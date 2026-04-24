package com.vtm.character_sheet.entity;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class PasswordResetTokenTest {

    @Test
    void notExpiredWhenInFuture() {
        PasswordResetToken token = new PasswordResetToken();
        token.setExpiresAt(LocalDateTime.now().plusHours(1));
        assertFalse(token.isExpired());
    }

    @Test
    void expiredWhenInPast() {
        PasswordResetToken token = new PasswordResetToken();
        token.setExpiresAt(LocalDateTime.now().minusMinutes(1));
        assertTrue(token.isExpired());
    }

    @Test
    void usedDefaultsFalse() {
        PasswordResetToken token = new PasswordResetToken();
        assertFalse(token.isUsed());
    }
}
