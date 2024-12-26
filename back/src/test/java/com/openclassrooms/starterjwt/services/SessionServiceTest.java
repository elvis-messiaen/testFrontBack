package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    @Test
    public void testCreate() {
        Session session = new Session();
        session.setId(1L);
        session.setName("Yoga Session");
        
        when(sessionRepository.save(session)).thenReturn(session);
        
        Session createdSession = sessionService.create(session);
        
        assertThat(createdSession).isNotNull();
        assertThat(createdSession.getId()).isEqualTo(1L);
        assertThat(createdSession.getName()).isEqualTo("Yoga Session");
    }

    @Test
    public void testDelete() {
        Long sessionId = 1L;
        
        sessionService.delete(sessionId);
        
        verify(sessionRepository).deleteById(sessionId);
    }

    @Test
    public void testFindAll() {
        Session session1 = new Session();
        session1.setId(1L);
        session1.setName("Yoga Session");
        
        Session session2 = new Session();
        session2.setId(2L);
        session2.setName("Pilates Session");
        
        when(sessionRepository.findAll()).thenReturn(Arrays.asList(session1, session2));
        
        List<Session> sessions = sessionService.findAll();
        
        assertThat(sessions).hasSize(2);
        assertThat(sessions.get(0).getName()).isEqualTo("Yoga Session");
        assertThat(sessions.get(1).getName()).isEqualTo("Pilates Session");
    }

    @Test
    public void testGetById() {
        Long sessionId = 1L;
        Session session = new Session();
        session.setId(sessionId);
        session.setName("Yoga Session");
        
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        
        Session foundSession = sessionService.getById(sessionId);
        
        assertThat(foundSession).isNotNull();
        assertThat(foundSession.getId()).isEqualTo(sessionId);
        assertThat(foundSession.getName()).isEqualTo("Yoga Session");
    }

    @Test
    public void testUpdate() {
        Long sessionId = 1L;
        Session session = new Session();
        session.setId(sessionId);
        session.setName("Yoga Session Updated");
        
        when(sessionRepository.save(session)).thenReturn(session);
        
        Session updatedSession = sessionService.update(sessionId, session);
        
        assertThat(updatedSession).isNotNull();
        assertThat(updatedSession.getId()).isEqualTo(sessionId);
        assertThat(updatedSession.getName()).isEqualTo("Yoga Session Updated");
    }

    @Test
    public void testParticipate() {
        Long sessionId = 1L;
        Long userId = 1L;
        User user = new User();
        user.setId(userId);
        Session session = new Session();
        session.setId(sessionId);
        session.setUsers(new ArrayList<>()); // Utiliser ArrayList pour rendre modifiable

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        
        sessionService.participate(sessionId, userId);
        
        assertThat(session.getUsers()).hasSize(1);
        assertThat(session.getUsers().get(0).getId()).isEqualTo(userId);
    }

    @Test
    public void testParticipateAlreadyParticipating() {
        Long sessionId = 1L;
        Long userId = 1L;
        User user = new User();
        user.setId(userId);
        
        Session session = new Session();
        session.setId(sessionId);
        session.setUsers(new ArrayList<>(Arrays.asList(user))); // Utiliser ArrayList pour rendre modifiable
        
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        
        assertThatThrownBy(() -> sessionService.participate(sessionId, userId))
            .isInstanceOf(BadRequestException.class);
    }

    @Test
    public void testNoLongerParticipate() {
        Long sessionId = 1L;
        Long userId = 1L;
        User user = new User();
        user.setId(userId);
        
        Session session = new Session();
        session.setId(sessionId);
        session.setUsers(new ArrayList<>(Arrays.asList(user))); // Utiliser ArrayList pour rendre modifiable
        
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        
        sessionService.noLongerParticipate(sessionId, userId);
        
        assertThat(session.getUsers()).isEmpty();
    }

    @Test
    public void testNoLongerParticipateNotParticipating() {
        Long sessionId = 1L;
        Long userId = 1L;
        
        Session session = new Session();
        session.setId(sessionId);
        session.setUsers(new ArrayList<>()); // Utiliser ArrayList pour rendre modifiable
        
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        
        assertThatThrownBy(() -> sessionService.noLongerParticipate(sessionId, userId))
            .isInstanceOf(BadRequestException.class);
    }

    @Test
    public void testParticipateSessionNotFound() {
        Long sessionId = 1L;
        Long userId = 1L;
        
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());
        
        assertThatThrownBy(() -> sessionService.participate(sessionId, userId))
            .isInstanceOf(NotFoundException.class);
    }

    @Test
    public void testParticipateUserNotFound() {
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = new Session();
        session.setId(sessionId);
        
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.empty());
        
        assertThatThrownBy(() -> sessionService.participate(sessionId, userId))
            .isInstanceOf(NotFoundException.class);
    }
}
