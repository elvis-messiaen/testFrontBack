package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class SessionControllerTest {

    @Mock
    private SessionService sessionService;

    @Mock
    private SessionMapper sessionMapper;

    @InjectMocks
    private SessionController sessionController;

    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(sessionController).build();
    }

    @Test
    public void testFindById_SessionExists() throws Exception {
        Session session = new Session();
        session.setId(1L);

        SessionDto sessionDto = new SessionDto();
        sessionDto.setId(1L);

        when(sessionService.getById(1L)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        mockMvc.perform(get("/api/session/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    public void testFindById_SessionNotFound() throws Exception {
        when(sessionService.getById(1L)).thenReturn(null);

        mockMvc.perform(get("/api/session/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testFindById_InvalidId() throws Exception {
        mockMvc.perform(get("/api/session/invalidId"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testFindAll() throws Exception {
        Session session1 = new Session();
        session1.setId(1L);

        Session session2 = new Session();
        session2.setId(2L);

        List<Session> sessions = Arrays.asList(session1, session2);

        SessionDto sessionDto1 = new SessionDto();
        sessionDto1.setId(1L);

        SessionDto sessionDto2 = new SessionDto();
        sessionDto2.setId(2L);

        List<SessionDto> sessionDtos = Arrays.asList(sessionDto1, sessionDto2);

        when(sessionService.findAll()).thenReturn(sessions);
        when(sessionMapper.toDto(sessions)).thenReturn(sessionDtos);

        mockMvc.perform(get("/api/session"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[1].id").value(2L));
    }

@Test
public void testCreate() throws Exception {
    SessionDto sessionDto = new SessionDto();
    sessionDto.setId(1L);
    sessionDto.setName("Yoga Session");
    sessionDto.setDate(new Date());
    sessionDto.setTeacher_id(1L);
    sessionDto.setDescription("A relaxing yoga session");

    Session session = new Session();
    session.setId(1L);

    doReturn(session).when(sessionMapper).toEntity(any(SessionDto.class));
    doReturn(session).when(sessionService).create(any(Session.class));
    doReturn(sessionDto).when(sessionMapper).toDto(any(Session.class));

    mockMvc.perform(post("/api/session")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"id\": 1, \"name\": \"Yoga Session\", \"date\": \"" + new Date().getTime() + "\", \"teacher_id\": 1, \"description\": \"A relaxing yoga session\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1L));
}


@Test
public void testUpdate() throws Exception {
    SessionDto sessionDto = new SessionDto();
    sessionDto.setId(1L);
    sessionDto.setName("Updated Yoga Session");
    sessionDto.setDate(new Date());
    sessionDto.setTeacher_id(1L);
    sessionDto.setDescription("An updated relaxing yoga session");

    Session session = new Session();
    session.setId(1L);

    doReturn(session).when(sessionMapper).toEntity(any(SessionDto.class));
    doReturn(session).when(sessionService).update(anyLong(), any(Session.class));
    doReturn(sessionDto).when(sessionMapper).toDto(any(Session.class));

    mockMvc.perform(put("/api/session/1")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"id\": 1, \"name\": \"Updated Yoga Session\", \"date\": \"" + new Date().getTime() + "\", \"teacher_id\": 1, \"description\": \"An updated relaxing yoga session\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1L));
}


    @Test
    public void testDelete_SessionExists() throws Exception {
        Session session = new Session();
        session.setId(1L);

        when(sessionService.getById(1L)).thenReturn(session);

        mockMvc.perform(delete("/api/session/1"))
                .andExpect(status().isOk());

        verify(sessionService).delete(1L);
    }

    @Test
    public void testDelete_SessionNotFound() throws Exception {
        when(sessionService.getById(1L)).thenReturn(null);

        mockMvc.perform(delete("/api/session/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testParticipate() throws Exception {
        mockMvc.perform(post("/api/session/1/participate/2"))
                .andExpect(status().isOk());

        verify(sessionService).participate(1L, 2L);
    }

    @Test
    public void testNoLongerParticipate() throws Exception {
        mockMvc.perform(delete("/api/session/1/participate/2"))
                .andExpect(status().isOk());

        verify(sessionService).noLongerParticipate(1L, 2L);
    }
}
