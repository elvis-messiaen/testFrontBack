package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerIntegrationSIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testAuthenticateUser() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("email@example.com");
        loginRequest.setPassword("password");

        User user = new User("email@example.com", "Nom", "Prenom", "encodedPassword", false);

        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("email@example.com")
                .firstName("Nom")
                .lastName("Prenom")
                .password("encodedPassword")
                .admin(false)
                .build();

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, "password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findByEmail(eq("email@example.com"))).thenReturn(Optional.of(user));
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("fake-jwt-token");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"));
    }

    @Test
    public void testRegisterUser_Success() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("email@example.com");
        signupRequest.setLastName("Nom");
        signupRequest.setFirstName("Prenom");
        signupRequest.setPassword("password");

        when(userRepository.existsByEmail(signupRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(signupRequest.getPassword())).thenReturn("encodedPassword");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));
    }

    @Test
    public void testRegisterUser_EmailTaken() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("email@example.com");
        signupRequest.setLastName("Nom");
        signupRequest.setFirstName("Prenom");
        signupRequest.setPassword("password");

        when(userRepository.existsByEmail(signupRequest.getEmail())).thenReturn(true);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));
    }
}
