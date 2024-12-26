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
import java.util.Date;
import java.util.Set;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
public class SessionModelTest {

    @MockBean
    private Session session;

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
        when(session.getId()).thenReturn(1L);
        when(session.getName()).thenReturn("Yoga Class");
        when(session.getDate()).thenReturn(new Date());
        when(session.getDescription()).thenReturn("A relaxing yoga class");

        assertThat(session.getId()).isEqualTo(1L);
        assertThat(session.getName()).isEqualTo("Yoga Class");
        assertThat(session.getDate()).isNotNull();
        assertThat(session.getDescription()).isEqualTo("A relaxing yoga class");
    }

    @Test
    public void testValidSession() {
        Session validSession = Session.builder()
                .name("Yoga Class")
                .date(new Date())
                .description("A relaxing yoga class")
                .build();

        Set<ConstraintViolation<Session>> violations = validator.validate(validSession);
        assertThat(violations).isEmpty();
    }

    @Test
    public void testInvalidSession_NameBlank() {
        Session invalidSession = Session.builder()
                .name("")
                .date(new Date())
                .description("A relaxing yoga class")
                .build();

        Set<ConstraintViolation<Session>> violations = validator.validate(invalidSession);
        assertThat(violations).isNotEmpty();
        assertThat(violations.iterator().next().getMessage()).isEqualTo("ne doit pas être vide");
    }

    @Test
    public void testInvalidSession_DateNull() {
        Session invalidSession = Session.builder()
                .name("Yoga Class")
                .date(null)
                .description("A relaxing yoga class")
                .build();

        Set<ConstraintViolation<Session>> violations = validator.validate(invalidSession);
        assertThat(violations).isNotEmpty();
        assertThat(violations.iterator().next().getMessage()).isEqualTo("ne doit pas être nul");
    }

    @Test
    public void testInvalidSession_DescriptionTooLong() {
        String longDescription = new String(new char[2501]).replace('\0', 'a');
        Session invalidSession = Session.builder()
                .name("Yoga Class")
                .date(new Date())
                .description(longDescription)
                .build();

        Set<ConstraintViolation<Session>> violations = validator.validate(invalidSession);
        assertThat(violations).isNotEmpty();
        assertThat(violations.iterator().next().getMessage()).isEqualTo("la taille doit être comprise entre 0 et 2500");
    }
}
