package com.openclassrooms.starterjwt.payload.response;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class JwtResponseTest {

    @Test
    public void testConstructorAndGetters() {
        String token = "testToken";
        Long id = 1L;
        String username = "testuser";
        String firstName = "First";
        String lastName = "Last";
        Boolean admin = true;

        JwtResponse jwtResponse = new JwtResponse(token, id, username, firstName, lastName, admin);

        assertEquals(token, jwtResponse.getToken());
        assertEquals("Bearer", jwtResponse.getType());
        assertEquals(id, jwtResponse.getId());
        assertEquals(username, jwtResponse.getUsername());
        assertEquals(firstName, jwtResponse.getFirstName());
        assertEquals(lastName, jwtResponse.getLastName());
        assertEquals(admin, jwtResponse.getAdmin());
    }

    @Test
    public void testSetters() {
        JwtResponse jwtResponse = new JwtResponse("token", 1L, "user", "First", "Last", true);

        String newToken = "newTestToken";
        jwtResponse.setToken(newToken);
        assertEquals(newToken, jwtResponse.getToken());

        String newType = "NewType";
        jwtResponse.setType(newType);
        assertEquals(newType, jwtResponse.getType());

        Long newId = 2L;
        jwtResponse.setId(newId);
        assertEquals(newId, jwtResponse.getId());

        String newUsername = "newTestuser";
        jwtResponse.setUsername(newUsername);
        assertEquals(newUsername, jwtResponse.getUsername());

        String newFirstName = "NewFirst";
        jwtResponse.setFirstName(newFirstName);
        assertEquals(newFirstName, jwtResponse.getFirstName());

        String newLastName = "NewLast";
        jwtResponse.setLastName(newLastName);
        assertEquals(newLastName, jwtResponse.getLastName());

        Boolean newAdmin = false;
        jwtResponse.setAdmin(newAdmin);
        assertEquals(newAdmin, jwtResponse.getAdmin());
    }
}
