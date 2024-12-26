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
public class TeacherModelTest {

    @MockBean
    private Teacher teacher;

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
        when(teacher.getId()).thenReturn(1L);
        when(teacher.getLastName()).thenReturn("Nom");
        when(teacher.getFirstName()).thenReturn("Prenom");

        assertThat(teacher.getId()).isEqualTo(1L);
        assertThat(teacher.getLastName()).isEqualTo("Nom");
        assertThat(teacher.getFirstName()).isEqualTo("Prenom");
    }

    @Test
    public void testValidTeacher() {
        Teacher validTeacher = Teacher.builder()
                .lastName("Nom")
                .firstName("Prenom")
                .build();

        Set<ConstraintViolation<Teacher>> violations = validator.validate(validTeacher);
        assertThat(violations).isEmpty();
    }

    @Test
    public void testInvalidTeacher_LastNameBlank() {
        Teacher invalidTeacher = Teacher.builder()
                .lastName("")
                .firstName("Prenom")
                .build();

        Set<ConstraintViolation<Teacher>> violations = validator.validate(invalidTeacher);
        assertThat(violations).isNotEmpty();
        assertThat(violations.iterator().next().getMessage()).isEqualTo("ne doit pas être vide");
    }

    @Test
    public void testInvalidTeacher_FirstNameBlank() {
        Teacher invalidTeacher = Teacher.builder()
                .lastName("Nom")
                .firstName("")
                .build();

        Set<ConstraintViolation<Teacher>> violations = validator.validate(invalidTeacher);
        assertThat(violations).isNotEmpty();
        assertThat(violations.iterator().next().getMessage()).isEqualTo("ne doit pas être vide");
    }

    @Test
    public void testInvalidTeacher_LastNameTooLong() {
        Teacher invalidTeacher = Teacher.builder()
                .lastName("NomNomNomNomNomNomNomNomNomNom") // 21 characters, exceeding the max size of 20
                .firstName("Prenom")
                .build();

        Set<ConstraintViolation<Teacher>> violations = validator.validate(invalidTeacher);
        assertThat(violations).isNotEmpty();
        assertThat(violations.iterator().next().getMessage()).isEqualTo("la taille doit être comprise entre 0 et 20");
    }

    @Test
    public void testInvalidTeacher_FirstNameTooLong() {
        Teacher invalidTeacher = Teacher.builder()
                .lastName("Nom")
                .firstName("PrenomPrenomPrenomPrenomPrenom") // 21 characters, exceeding the max size of 20
                .build();

        Set<ConstraintViolation<Teacher>> violations = validator.validate(invalidTeacher);
        assertThat(violations).isNotEmpty();
        assertThat(violations.iterator().next().getMessage()).isEqualTo("la taille doit être comprise entre 0 et 20");
    }
}
