package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;


import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
public class UserModelTest {

    @MockBean
    private User user;

    private Validator validator;
    private LocalValidatorFactoryBean factoryBean;

    @BeforeEach
    public void setUp() {
        factoryBean = new LocalValidatorFactoryBean();
        factoryBean.afterPropertiesSet();
        validator = factoryBean.getValidator();
    }

    @AfterEach
    public void tearDown() {
        factoryBean.destroy();
    }

    @Test
    public void testGettersAndSetters() {
        when(user.getId()).thenReturn(1L);
        when(user.getEmail()).thenReturn("email@example.com");
        when(user.getLastName()).thenReturn("Nom");
        when(user.getFirstName()).thenReturn("Prenom");
        when(user.getPassword()).thenReturn("motdepasse");
        when(user.isAdmin()).thenReturn(true);

        assertThat(user.getId()).isEqualTo(1L);
        assertThat(user.getEmail()).isEqualTo("email@example.com");
        assertThat(user.getLastName()).isEqualTo("Nom");
        assertThat(user.getFirstName()).isEqualTo("Prenom");
        assertThat(user.getPassword()).isEqualTo("motdepasse");
        assertThat(user.isAdmin()).isTrue();
    }

    @Test
    public void testValidUser() {
        User validUser = User.builder()
                .email("test@example.com")
                .lastName("Nom")
                .firstName("Prenom")
                .password("motdepasse")
                .admin(true)
                .build();

        Set<ConstraintViolation<User>> violations = validator.validate(validUser);
        assertThat(violations).isEmpty();
    }

    @Test
    public void testInvalidUser_EmailInvalid() {
        User invalidUser = User.builder()
                .email("invalid-email")
                .lastName("Nom")
                .firstName("Prenom")
                .password("motdepasse")
                .admin(true)
                .build();

        Set<ConstraintViolation<User>> violations = validator.validate(invalidUser);
        assertThat(violations).isNotEmpty();
        assertThat(violations.iterator().next().getMessage()).isEqualTo("doit être une adresse électronique syntaxiquement correcte");
    }

    @Test
    public void testInvalidUser_LastNameTooLong() {
        User invalidUser = User.builder()
                .email("test@example.com")
                .lastName("NomNomNomNomNomNomNomNomNomNom")
                .firstName("Prenom")
                .password("motdepasse")
                .admin(true)
                .build();

        Set<ConstraintViolation<User>> violations = validator.validate(invalidUser);
        assertThat(violations).isNotEmpty();
        assertThat(violations.iterator().next().getMessage()).isEqualTo("la taille doit être comprise entre 0 et 20");
    }

    @Test
    public void testInvalidUser_FirstNameTooLong() {
        User invalidUser = User.builder()
                .email("test@example.com")
                .lastName("Nom")
                .firstName("PrenomPrenomPrenomPrenomPrenom")
                .password("motdepasse")
                .admin(true)
                .build();

        Set<ConstraintViolation<User>> violations = validator.validate(invalidUser);
        assertThat(violations).isNotEmpty();
        assertThat(violations.iterator().next().getMessage()).isEqualTo("la taille doit être comprise entre 0 et 20");
    }
}
