package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import java.util.Optional;
import java.util.Arrays;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@SpringBootTest
public class SessionServiceIntegrationSIT {

    @Mock
    private SessionRepository sessionRepository;

    @InjectMocks
    private SessionService sessionService;

    @Test
    public void testFindAll() {
        Session session1 = new Session();
        session1.setId(1L);
        session1.setName("Session 1");

        Session session2 = new Session();
        session2.setId(2L);
        session2.setName("Session 2");

        when(sessionRepository.findAll()).thenReturn(Arrays.asList(session1, session2));

        List<Session> sessions = sessionService.findAll();

        assertThat(sessions).hasSize(2);
        assertThat(sessions.get(0).getId()).isEqualTo(1L);
        assertThat(sessions.get(1).getId()).isEqualTo(2L);
    }

    @Test
    public void testFindById() {
        Long sessionId = 1L;
        Session session = new Session();
        session.setId(sessionId);
        session.setName("Session 1");

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        Session foundSession = sessionService.getById(sessionId);

        assertThat(foundSession).isNotNull();
        assertThat(foundSession.getId()).isEqualTo(sessionId);
        assertThat(foundSession.getName()).isEqualTo("Session 1");
    }

    @Test
    public void testFindByIdNotFound() {
        Long sessionId = 1L;

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        Session foundSession = sessionService.getById(sessionId);

        assertThat(foundSession).isNull();
    }
}
