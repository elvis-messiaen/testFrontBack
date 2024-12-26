package com.openclassrooms.starterjwt.repository;

import com.openclassrooms.starterjwt.models.Session;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import org.mockito.Mock;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class SessionRepositoryTest {

    @Mock
    private SessionRepository sessionRepository;

    @Test
    public void testFindById() {
        Session session = new Session();
        session.setId(1L);
        session.setName("Yoga Session");
        session.setDate(session.getDate());
        session.setDescription("A relaxing yoga session");

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        Optional<Session> foundSession = sessionRepository.findById(1L);
        assertThat(foundSession).isPresent();
        assertThat(foundSession.get().getId()).isEqualTo(1L);
        assertThat(foundSession.get().getName()).isEqualTo("Yoga Session");
    }

    @Test
    public void testExistsById() {
        when(sessionRepository.existsById(1L)).thenReturn(true);

        Boolean exists = sessionRepository.existsById(1L);
        assertThat(exists).isTrue();
    }
}
