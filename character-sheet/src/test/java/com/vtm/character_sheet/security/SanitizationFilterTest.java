package com.vtm.character_sheet.security;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.junit.jupiter.api.Assertions.*;

class SanitizationFilterTest {

    private final SanitizationFilter filter = new SanitizationFilter();

    @Test
    void sanitizesScriptTags() {
        String result = SanitizationFilter.sanitize("<script>alert('xss')</script>");
        assertFalse(result.contains("<script>"));
        assertFalse(result.contains("</script>"));
    }

    @Test
    void preservesPlainText() {
        assertEquals("Hello World", SanitizationFilter.sanitize("Hello World"));
    }

    @Test
    void handlesNull() {
        assertNull(SanitizationFilter.sanitize(null));
    }

    @Test
    void stripsHtmlTags() {
        String result = SanitizationFilter.sanitize("<b>bold</b> text");
        assertEquals("bold text", result);
    }

    @Test
    void sanitizesRequestParameters() throws Exception {
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/test");
        req.setParameter("name", "<script>alert(1)</script>test");
        MockHttpServletResponse res = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilterInternal(req, res, chain);

        // The chain received the wrapped request
        String param = chain.getRequest().getParameter("name");
        assertFalse(param.contains("<script>"));
        assertTrue(param.contains("test"));
    }
}
