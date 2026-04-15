package com.vtm.character_sheet;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthFlowTest {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper mapper;

    private String json(Object obj) throws Exception {
        return mapper.writeValueAsString(obj);
    }

    @Test
    void registerAndLogin() throws Exception {
        String username = "testuser_" + System.currentTimeMillis();

        // Register
        MvcResult result = mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "username", username,
                                "email", username + "@test.com",
                                "password", "secret123",
                                "role", "PLAYER"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.username").value(username))
                .andExpect(jsonPath("$.role").value("PLAYER"))
                .andReturn();

        // Login with same credentials
        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("username", username, "password", "secret123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.username").value(username));
    }

    @Test
    void loginWithBadPassword() throws Exception {
        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("username", "nobody", "password", "wrong"))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid username or password"));
    }

    @Test
    void registerDuplicateUsername() throws Exception {
        String username = "dupuser_" + System.currentTimeMillis();
        String body = json(Map.of(
                "username", username, "email", username + "@test.com", "password", "secret123"));

        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk());

        // Same username, different email
        String body2 = json(Map.of(
                "username", username, "email", "other_" + username + "@test.com", "password", "secret123"));

        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body2))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Username already taken"));
    }

    @Test
    void shortPasswordRejected() throws Exception {
        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "username", "short_" + System.currentTimeMillis(),
                                "email", "short@test.com",
                                "password", "abc"
                        ))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Password must be at least 6 characters"));
    }

    @Test
    void protectedEndpointRequiresAuth() throws Exception {
        mvc.perform(get("/api/characters"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedEndpointWorksWithToken() throws Exception {
        String username = "authuser_" + System.currentTimeMillis();

        MvcResult result = mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "username", username,
                                "email", username + "@test.com",
                                "password", "secret123"
                        ))))
                .andExpect(status().isOk())
                .andReturn();

        String token = mapper.readTree(result.getResponse().getContentAsString()).get("token").asText();

        mvc.perform(get("/api/characters").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void catalogEndpointsArePublic() throws Exception {
        mvc.perform(get("/api/merits")).andExpect(status().isOk());
        mvc.perform(get("/api/flaws")).andExpect(status().isOk());
    }
}
