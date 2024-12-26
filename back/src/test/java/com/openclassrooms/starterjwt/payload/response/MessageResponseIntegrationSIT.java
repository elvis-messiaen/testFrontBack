package com.openclassrooms.starterjwt.payload.response;

import com.openclassrooms.starterjwt.payload.request.SignupRequest;
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
public class MessageResponseIntegrationSIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testMessageResponse() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("new5656@example.com");
        signupRequest.setPassword("new5656565password");
        signupRequest.setFirstName("First");
        signupRequest.setLastName("Last");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));
    }

    @Test
    public void testMessageResponseEmailAlreadyTaken() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("existinguser12@example.com");
        signupRequest.setPassword("existingpassword");
        signupRequest.setFirstName("First");
        signupRequest.setLastName("Last");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk());

        SignupRequest duplicateSignupRequest = new SignupRequest();
        duplicateSignupRequest.setEmail("existinguser12@example.com");
        duplicateSignupRequest.setPassword("newpassword");
        duplicateSignupRequest.setFirstName("First");
        duplicateSignupRequest.setLastName("Last");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(duplicateSignupRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));
    }
}
