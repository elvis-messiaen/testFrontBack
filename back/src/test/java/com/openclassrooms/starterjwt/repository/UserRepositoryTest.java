package com.openclassrooms.starterjwt.repository;

import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import org.mockito.Mock;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class UserRepositoryTest {

    @Mock
    private UserRepository userRepository;

    @Test
    public void testFindByEmail() {
        User user = new User();
        user.setId(1L);
        user.setEmail("email@example.com");
        user.setLastName("Nom");
        user.setFirstName("Prenom");
        user.setPassword("motdepasse");
        user.setAdmin(true);

        when(userRepository.findByEmail("email@example.com")).thenReturn(Optional.of(user));

        Optional<User> foundUser = userRepository.findByEmail("email@example.com");
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getEmail()).isEqualTo("email@example.com");
    }

    @Test
    public void testExistsByEmail() {
        when(userRepository.existsByEmail("email@example.com")).thenReturn(true);

        Boolean exists = userRepository.existsByEmail("email@example.com");
        assertThat(exists).isTrue();
    }
}
