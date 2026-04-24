package com.vtm.character_sheet.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        // 64-byte secret for HMAC-SHA (minimum for HS512)
        String secret = "test-secret-key-that-is-long-enough-for-hmac-sha-algorithm-ok!";
        jwtUtil = new JwtUtil(secret, 86400000L, 604800000L);
    }

    @Test
    void generateAndParseToken() {
        String token = jwtUtil.generateToken("alice", "PLAYER");

        assertTrue(jwtUtil.isValid(token));
        assertEquals("alice", jwtUtil.getUsername(token));
        assertEquals("PLAYER", jwtUtil.getRole(token));
    }

    @Test
    void tokenContainsRole() {
        String token = jwtUtil.generateToken("bob", "STORYTELLER");
        assertEquals("STORYTELLER", jwtUtil.getRole(token));
    }

    @Test
    void adminRoleToken() {
        String token = jwtUtil.generateToken("admin", "ADMIN");
        assertEquals("ADMIN", jwtUtil.getRole(token));
    }

    @Test
    void invalidTokenReturnsFalse() {
        assertFalse(jwtUtil.isValid("not.a.valid.token"));
    }

    @Test
    void emptyTokenReturnsFalse() {
        assertFalse(jwtUtil.isValid(""));
    }

    @Test
    void expiredTokenIsInvalid() {
        JwtUtil shortLived = new JwtUtil(
                "test-secret-key-that-is-long-enough-for-hmac-sha-algorithm-ok!", 0L, 0L);
        String token = shortLived.generateToken("expired", "PLAYER");
        assertFalse(shortLived.isValid(token));
    }

    @Test
    void differentSecretCannotParse() {
        String token = jwtUtil.generateToken("alice", "PLAYER");
        JwtUtil otherUtil = new JwtUtil(
                "different-secret-key-long-enough-for-hmac-sha-algorithm-ok!!", 86400000L, 604800000L);
        assertFalse(otherUtil.isValid(token));
    }
}
