package com.openclassrooms.starterjwt.payload.request;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class LoginRequestTest {

    @Test
    public void testGetSetEmail() {
        LoginRequest loginRequest = new LoginRequest();
        String email = "test@example.com";
        loginRequest.setEmail(email);
        assertEquals(email, loginRequest.getEmail());
    }

    @Test
    public void testGetSetPassword() {
        LoginRequest loginRequest = new LoginRequest();
        String password = "password123";
        loginRequest.setPassword(password);
        assertEquals(password, loginRequest.getPassword());
    }

    @Test
    public void testNotBlankEmail() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(" ");
        assertNotNull(loginRequest.getEmail());
        assertNotEquals(" ", loginRequest.getEmail().trim());
    }

    @Test
    public void testNotBlankPassword() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setPassword(" ");
        assertNotNull(loginRequest.getPassword());
        assertNotEquals(" ", loginRequest.getPassword().trim());
    }
}
