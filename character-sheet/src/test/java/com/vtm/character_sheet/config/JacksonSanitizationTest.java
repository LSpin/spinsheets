package com.vtm.character_sheet.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class JacksonSanitizationTest {

    private ObjectMapper mapper;

    @BeforeEach
    void setUp() {
        mapper = new ObjectMapper();
        JacksonConfig config = new JacksonConfig();
        mapper.registerModule(config.htmlSanitizationModule());
    }

    @Test
    void stripsScriptTags() throws Exception {
        String json = "{\"name\":\"<script>alert(1)</script>Bob\"}";
        Map<?, ?> result = mapper.readValue(json, Map.class);
        String name = (String) result.get("name");
        assertFalse(name.contains("<script>"));
        assertTrue(name.contains("Bob"));
    }

    @Test
    void preservesPlainText() throws Exception {
        String json = "{\"name\":\"Alice the Vampire\"}";
        Map<?, ?> result = mapper.readValue(json, Map.class);
        assertEquals("Alice the Vampire", result.get("name"));
    }

    @Test
    void preservesNumbers() throws Exception {
        String json = "{\"value\":\"42\"}";
        Map<?, ?> result = mapper.readValue(json, Map.class);
        assertEquals("42", result.get("value"));
    }

    @Test
    void handlesEmptyString() throws Exception {
        String json = "{\"name\":\"\"}";
        Map<?, ?> result = mapper.readValue(json, Map.class);
        assertEquals("", result.get("name"));
    }

    @Test
    void handlesNullValue() throws Exception {
        String json = "{\"name\":null}";
        Map<?, ?> result = mapper.readValue(json, Map.class);
        assertNull(result.get("name"));
    }

    @Test
    void stripsImgTags() throws Exception {
        String json = "{\"bio\":\"Hello <img src=x onerror=alert(1)> World\"}";
        Map<?, ?> result = mapper.readValue(json, Map.class);
        String bio = (String) result.get("bio");
        assertFalse(bio.contains("<img"));
        assertTrue(bio.contains("Hello"));
        assertTrue(bio.contains("World"));
    }

    @Test
    void preservesNewlines() throws Exception {
        String json = "{\"notes\":\"Line1\\nLine2\\nLine3\"}";
        Map<?, ?> result = mapper.readValue(json, Map.class);
        String notes = (String) result.get("notes");
        assertTrue(notes.contains("\n"));
        assertEquals("Line1\nLine2\nLine3", notes);
    }

    @Test
    void preservesSpecialCharacters() throws Exception {
        String json = "{\"name\":\"Clan: Brujah (V20)\"}";
        Map<?, ?> result = mapper.readValue(json, Map.class);
        String name = (String) result.get("name");
        assertTrue(name.contains("Brujah"));
        assertTrue(name.contains("V20"));
    }

    @Test
    void preservesCommaDelimitedArtsData() throws Exception {
        // Changeling Arts data stored as "Art:Level" pairs
        String json = "{\"sorceryDesc\":\"Chicanery:3,Wayfare:2,Primal:1\"}";
        Map<?, ?> result = mapper.readValue(json, Map.class);
        assertEquals("Chicanery:3,Wayfare:2,Primal:1", result.get("sorceryDesc"));
    }
}
