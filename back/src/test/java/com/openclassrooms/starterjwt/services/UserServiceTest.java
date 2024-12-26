package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    public void testDelete() {
        Long userId = 1L;

        userService.delete(userId);

        verify(userRepository).deleteById(userId);
    }

    @Test
    public void testFindById() {
        Long userId = 1L;
        User user = new User();
        user.setId(userId);
        user.setEmail("email@example.com");
        user.setLastName("Nom");
        user.setFirstName("Prenom");
        user.setPassword("motdepasse");
        user.setAdmin(true);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        User foundUser = userService.findById(userId);

        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getId()).isEqualTo(userId);
        assertThat(foundUser.getEmail()).isEqualTo("email@example.com");
    }

    @Test
    public void testFindByIdNotFound() {
        Long userId = 1L;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        User foundUser = userService.findById(userId);

        assertThat(foundUser).isNull();
    }
}
