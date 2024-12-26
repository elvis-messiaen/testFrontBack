package com.openclassrooms.starterjwt.security.jwt;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import java.lang.reflect.Field;
import static org.mockito.Mockito.when;
import static org.assertj.core.api.Assertions.assertThat;

public class JwtUtilsTest {

    @InjectMocks
    private JwtUtils jwtUtils;

    @Mock
    private Authentication authentication;

    private final String jwtSecret = "testSecretKey";
    private final int jwtExpirationMs = 60000;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        setField(jwtUtils, "jwtSecret", jwtSecret);
        setField(jwtUtils, "jwtExpirationMs", jwtExpirationMs);
    }

    @Test
    public void testGenerateJwtToken() {
        String username = "testuser";
        String password = "testpassword";
        Long userId = 123L;
        Boolean admin = false;

        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(userId)
                .username(username)
                .firstName("firstnae")
                .lastName("lastnae")
                .admin(admin)
                .password(password)
                .build();

        when(authentication.getPrincipal()).thenReturn(userDetails);

        String token = jwtUtils.generateJwtToken(authentication);

        assertThat(token).isNotNull();
    }

    @Test
    public void testGetUserNameFromJwtToken() {
        String username = "testuser";
        String password = "testpassword";
        Long userId = 123L;
        Boolean admin = false;

        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(userId)
                .username(username)
                .firstName("firstnae")
                .lastName("lastnae")
                .admin(admin)
                .password(password)
                .build();

        when(authentication.getPrincipal()).thenReturn(userDetails);

        String token = jwtUtils.generateJwtToken(authentication);
        String extractedUsername = jwtUtils.getUserNameFromJwtToken(token);

        assertThat(extractedUsername).isEqualTo(username);
    }

    @Test
    public void testValidateJwtToken_ValidToken() {
        String username = "testuser";
        String password = "testpassword";
        Long userId = 123L;
        Boolean admin = false;

        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(userId)
                .username(username)
                .firstName("firstnae")
                .lastName("lastnae")
                .admin(admin)
                .password(password)
                .build();

        when(authentication.getPrincipal()).thenReturn(userDetails);

        String token = jwtUtils.generateJwtToken(authentication);
        boolean isValid = jwtUtils.validateJwtToken(token);

        assertThat(isValid).isTrue();
    }

    @Test
    public void testValidateJwtToken_InvalidToken() {
        String invalidToken = "invalidToken";
        boolean isValid = jwtUtils.validateJwtToken(invalidToken);

        assertThat(isValid).isFalse();
    }

    private void setField(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }
}
