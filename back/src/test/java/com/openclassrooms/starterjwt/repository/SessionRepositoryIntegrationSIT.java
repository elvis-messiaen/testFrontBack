package com.openclassrooms.starterjwt.repository;

import com.openclassrooms.starterjwt.models.Session;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class SessionRepositoryIntegrationSIT {

    @Autowired
    private SessionRepository sessionRepository;

    @Test
    public void testFindById_ShouldReturnSession_WhenSessionExists() {
        Session session = new Session();
        session.setName("Yoga Session");
        session.setDate(java.util.Date.from(java.time.Instant.now()));
        session.setDescription("A relaxing yoga session");

        Session savedSession = sessionRepository.save(session);

        Optional<Session> foundSession = sessionRepository.findById(savedSession.getId());

        assertThat(foundSession).isPresent();
        assertThat(foundSession.get().getId()).isEqualTo(savedSession.getId());
        assertThat(foundSession.get().getName()).isEqualTo("Yoga Session");
        assertThat(foundSession.get().getDescription()).isEqualTo("A relaxing yoga session");
    }

    @Test
    public void testExistsById_ShouldReturnTrue_WhenSessionExists() {
        Session session = new Session();
        session.setName("Yoga Session");
        session.setDate(java.util.Date.from(java.time.Instant.now()));
        session.setDescription("A relaxing yoga session");

        Session savedSession = sessionRepository.save(session);

        Boolean exists = sessionRepository.existsById(savedSession.getId());

        assertThat(exists).isTrue();
    }
}
