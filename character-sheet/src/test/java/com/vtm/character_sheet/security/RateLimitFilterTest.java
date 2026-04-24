package com.vtm.character_sheet.security;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.junit.jupiter.api.Assertions.*;

class RateLimitFilterTest {

    private final RateLimitFilter filter = new RateLimitFilter();

    @Test
    void allowsRequestsUnderLimit() throws Exception {
        for (int i = 0; i < 10; i++) {
            MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/auth/login");
            req.setRemoteAddr("10.0.0.1");
            MockHttpServletResponse res = new MockHttpServletResponse();

            filter.doFilterInternal(req, res, new MockFilterChain());
            assertEquals(200, res.getStatus());
        }
    }

    @Test
    void blocksRequestsOverLimit() throws Exception {
        String ip = "10.0.0.2";

        // Exhaust the 10-request bucket
        for (int i = 0; i < 10; i++) {
            MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/auth/login");
            req.setRemoteAddr(ip);
            filter.doFilterInternal(req, new MockHttpServletResponse(), new MockFilterChain());
        }

        // 11th request should be rate-limited
        MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/auth/login");
        req.setRemoteAddr(ip);
        MockHttpServletResponse res = new MockHttpServletResponse();
        filter.doFilterInternal(req, res, new MockFilterChain());

        assertEquals(429, res.getStatus());
        assertTrue(res.getContentAsString().contains("Too many requests"));
    }

    @Test
    void differentIpsHaveSeparateBuckets() throws Exception {
        // Exhaust IP A
        for (int i = 0; i < 10; i++) {
            MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/auth/login");
            req.setRemoteAddr("10.0.0.3");
            filter.doFilterInternal(req, new MockHttpServletResponse(), new MockFilterChain());
        }

        // IP B should still be fine
        MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/auth/login");
        req.setRemoteAddr("10.0.0.4");
        MockHttpServletResponse res = new MockHttpServletResponse();
        filter.doFilterInternal(req, res, new MockFilterChain());

        assertEquals(200, res.getStatus());
    }

    @Test
    void skipsNonAuthEndpoints() {
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/characters");
        assertTrue(filter.shouldNotFilter(req));
    }

    @Test
    void filtersAuthEndpoints() {
        MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/auth/login");
        assertFalse(filter.shouldNotFilter(req));
    }
}
