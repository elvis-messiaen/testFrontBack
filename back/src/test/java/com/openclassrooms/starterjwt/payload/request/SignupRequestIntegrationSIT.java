package com.openclassrooms.starterjwt.payload.request;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SignupRequestIntegrationSIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testSignupRequest_Success() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("sisiisisr@example.com");
        signupRequest.setPassword("password123");
        signupRequest.setFirstName("Test");
        signupRequest.setLastName("User");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));
    }

    @Test
    public void testSignupRequest_EmailAlreadyTaken() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("sosoososo@example.com");
        signupRequest.setPassword("password123");
        signupRequest.setFirstName("Test");
        signupRequest.setLastName("User");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk());

        SignupRequest duplicateSignupRequest = new SignupRequest();
        duplicateSignupRequest.setEmail("sosoososo@example.com");
        duplicateSignupRequest.setPassword("password123");
        duplicateSignupRequest.setFirstName("Test");
        duplicateSignupRequest.setLastName("User");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(duplicateSignupRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));
    }

    @Test
    public void testSignupRequest_InvalidEmailFormat() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("invalid-email");
        signupRequest.setPassword("password123");
        signupRequest.setFirstName("Test");
        signupRequest.setLastName("User");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testSignupRequest_ShortPassword() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("lilil@example.com");
        signupRequest.setPassword("123");
        signupRequest.setFirstName("Test");
        signupRequest.setLastName("User");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest());
    }
}
