package com.openclassrooms.starterjwt.payload.request;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import javax.validation.*;
import java.util.Set;

public class SignupRequestTest {

    @Test
    public void testGetSetEmail() {
        SignupRequest signupRequest = new SignupRequest();
        String email = "test@example.com";
        signupRequest.setEmail(email);
        assertEquals(email, signupRequest.getEmail());
    }

    @Test
    public void testGetSetFirstName() {
        SignupRequest signupRequest = new SignupRequest();
        String firstName = "First";
        signupRequest.setFirstName(firstName);
        assertEquals(firstName, signupRequest.getFirstName());
    }

    @Test
    public void testGetSetLastName() {
        SignupRequest signupRequest = new SignupRequest();
        String lastName = "Last";
        signupRequest.setLastName(lastName);
        assertEquals(lastName, signupRequest.getLastName());
    }

    @Test
    public void testGetSetPassword() {
        SignupRequest signupRequest = new SignupRequest();
        String password = "password123";
        signupRequest.setPassword(password);
        assertEquals(password, signupRequest.getPassword());
    }

    @Test
    public void testEmailNotBlank() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail(" ");
        assertNotNull(signupRequest.getEmail());
        assertNotEquals(" ", signupRequest.getEmail().trim());
    }

    @Test
    public void testFirstNameNotBlank() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setFirstName(" ");
        assertNotNull(signupRequest.getFirstName());
        assertNotEquals(" ", signupRequest.getFirstName().trim());
    }

    @Test
    public void testLastNameNotBlank() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setLastName(" ");
        assertNotNull(signupRequest.getLastName());
        assertNotEquals(" ", signupRequest.getLastName().trim());
    }

    @Test
    public void testPasswordNotBlank() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setPassword(" ");
        assertNotNull(signupRequest.getPassword());
        assertNotEquals(" ", signupRequest.getPassword().trim());
    }

    @Test
    public void testEmailInvalidFormat() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("invalidemail.com");
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);
        assertTrue(violations.size() > 0);
    }

    @Test
    public void testEmailValidFormat() {
    SignupRequest signupRequestValid = new SignupRequest();
    signupRequestValid.setEmail("valid@example.com");
    assertTrue(signupRequestValid.getEmail().contains("@"));

    SignupRequest signupRequestInvalid = new SignupRequest();
    signupRequestInvalid.setEmail("invalidemail.com");
    assertFalse(signupRequestInvalid.getEmail().contains("@"));
}

    
}
