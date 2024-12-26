package com.openclassrooms.starterjwt.repository;

import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class UserRepositoryIntegrationSIT {

    @Autowired
    private UserRepository userRepository;

    private void clearDatabase() {
        userRepository.deleteAll();
    }

    @Test
    public void testFindByEmail_ShouldReturnUser_WhenUserExists() {
        clearDatabase();

        User user = new User();
        user.setEmail("email@example.com");
        user.setLastName("Nom");
        user.setFirstName("Prenom");
        user.setPassword("motdepasse");
        user.setAdmin(true);

        User savedUser = userRepository.save(user);

        Optional<User> foundUser = userRepository.findByEmail(savedUser.getEmail());

        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getEmail()).isEqualTo(savedUser.getEmail());
        assertThat(foundUser.get().getLastName()).isEqualTo("Nom");
        assertThat(foundUser.get().getFirstName()).isEqualTo("Prenom");
    }

    @Test
    public void testExistsByEmail_ShouldReturnTrue_WhenUserExists() {
        clearDatabase();

        User user = new User();
        user.setEmail("email@example.com");
        user.setLastName("Nom");
        user.setFirstName("Prenom");
        user.setPassword("motdepasse");
        user.setAdmin(true);

        userRepository.save(user);

        Boolean exists = userRepository.existsByEmail("email@example.com");

        assertThat(exists).isTrue();
    }
}
