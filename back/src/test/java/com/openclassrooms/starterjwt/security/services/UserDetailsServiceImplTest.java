package com.openclassrooms.starterjwt.security.services;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLoadUserByUsername_UserFound() {
        String email = "test@example.com";
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail(email);
        mockUser.setPassword("password123");
        mockUser.setFirstName("Test");
        mockUser.setLastName("User");

        when(userRepository.findByEmail(email)).thenReturn(java.util.Optional.of(mockUser));

        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsService.loadUserByUsername(email);

        assertNotNull(userDetails);
        assertEquals(mockUser.getEmail(), userDetails.getUsername());
        assertEquals(mockUser.getPassword(), userDetails.getPassword());
    }

    @Test
    void testLoadUserByUsername_UserNotFound() {
        String email = "notfound@example.com";

        when(userRepository.findByEmail(email)).thenReturn(java.util.Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> {
            userDetailsService.loadUserByUsername(email);
        });
    }
}

