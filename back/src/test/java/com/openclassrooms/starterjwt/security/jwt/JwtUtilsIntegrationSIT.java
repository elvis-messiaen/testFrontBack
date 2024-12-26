package com.openclassrooms.starterjwt.security.jwt;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class JwtUtilsIntegrationSIT {

    @Autowired
    private JwtUtils jwtUtils;

    private Authentication authentication;

    @BeforeEach
    public void setUp() {
        UserDetailsImpl userPrincipal = UserDetailsImpl.builder()
            .id(1L)
            .username("testUser")
            .firstName("Test")
            .lastName("User")
            .admin(false)
            .password("password")
            .build();

        authentication = new UsernamePasswordAuthenticationToken(userPrincipal, "password");
    }

    @Test
    public void testGenerateJwtToken() {
        assertNotNull(jwtUtils);

        String jwtToken = jwtUtils.generateJwtToken(authentication);
        assertNotNull(jwtToken);
        assertFalse(jwtToken.isEmpty());
    }

    @Test
    public void testGetUserNameFromJwtToken() {
        assertNotNull(jwtUtils);

        String jwtToken = jwtUtils.generateJwtToken(authentication);
        String userName = jwtUtils.getUserNameFromJwtToken(jwtToken);
        assertEquals("testUser", userName);
    }

    @Test
    public void testValidateJwtToken_ValidToken() {
        assertNotNull(jwtUtils);

        String jwtToken = jwtUtils.generateJwtToken(authentication);
        boolean isValid = jwtUtils.validateJwtToken(jwtToken);
        assertTrue(isValid);
    }

    @Test
    public void testValidateJwtToken_InvalidToken() {
        assertNotNull(jwtUtils);

        String invalidToken = "invalidToken";
        boolean isValid = jwtUtils.validateJwtToken(invalidToken);
        assertFalse(isValid);
    }
}
