package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class UserServiceIntegrationSIT {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    private void clearDatabase() {
        userRepository.deleteAll();
    }

    @Test
    public void testDelete_ShouldDeleteUser_WhenUserExists() {
        clearDatabase();

        User user = new User();
        user.setEmail("email@example.com");
        user.setLastName("Nom");
        user.setFirstName("Prenom");
        user.setPassword("motdepasse");
        user.setAdmin(true);

        User savedUser = userRepository.save(user);

        userService.delete(savedUser.getId());

        assertThat(userRepository.findById(savedUser.getId())).isEmpty();
    }

    @Test
    public void testFindById_ShouldReturnUser_WhenUserExists() {
        clearDatabase();

        User user = new User();
        user.setEmail("email@example.com");
        user.setLastName("Nom");
        user.setFirstName("Prenom");
        user.setPassword("motdepasse");
        user.setAdmin(true);

        User savedUser = userRepository.save(user);

        User foundUser = userService.findById(savedUser.getId());

        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getId()).isEqualTo(savedUser.getId());
        assertThat(foundUser.getEmail()).isEqualTo("email@example.com");
        assertThat(foundUser.getLastName()).isEqualTo("Nom");
        assertThat(foundUser.getFirstName()).isEqualTo("Prenom");
    }

    @Test
    public void testFindById_ShouldReturnNull_WhenUserNotFound() {
        Long userId = 999L;

        User foundUser = userService.findById(userId);

        assertThat(foundUser).isNull();
    }
}
