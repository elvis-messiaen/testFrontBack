package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Date;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith({SpringExtension.class, MockitoExtension.class})
public class SessionControllerIntegrationSIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SessionService sessionService;

    @MockBean
    private SessionMapper sessionMapper;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @WithMockUser
    public void testFindById() throws Exception {
        Session session = new Session();
        session.setId(1L);
        session.setName("Test Session");

        SessionDto sessionDto = new SessionDto();
        sessionDto.setId(1L);
        sessionDto.setName("Test Session");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(1L);
        sessionDto.setDescription("Session Description");

        when(sessionService.getById(1L)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        mockMvc.perform(get("/api/session/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    @WithMockUser
    public void testFindAll() throws Exception {
        Session session = new Session();
        session.setId(1L);
        session.setName("Test Session");

        SessionDto sessionDto = new SessionDto();
        sessionDto.setId(1L);
        sessionDto.setName("Test Session");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(1L);
        sessionDto.setDescription("Session Description");

        when(sessionService.findAll()).thenReturn(Collections.singletonList(session));
        when(sessionMapper.toDto(ArgumentMatchers.anyList())).thenReturn(Collections.singletonList(sessionDto));

        mockMvc.perform(get("/api/session"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    @WithMockUser
    public void testCreate() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setId(1L);
        sessionDto.setName("Test Session");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(1L);
        sessionDto.setDescription("Session Description");

        Session session = new Session();
        session.setId(1L);
        session.setName("Test Session");
        session.setDate(new Date());
        session.setDescription("Session Description");

        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.create(session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        mockMvc.perform(post("/api/session")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    @WithMockUser
    public void testUpdate() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setId(1L);
        sessionDto.setName("Updated Session");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(1L);
        sessionDto.setDescription("Updated Session Description");

        Session session = new Session();
        session.setId(1L);
        session.setName("Updated Session");
        session.setDate(new Date());
        session.setDescription("Updated Session Description");

        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.update(1L, session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        mockMvc.perform(put("/api/session/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    @WithMockUser
    public void testDelete() throws Exception {
        Session session = new Session();
        session.setId(1L);

        when(sessionService.getById(1L)).thenReturn(session);

        mockMvc.perform(delete("/api/session/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    public void testParticipate() throws Exception {
        mockMvc.perform(post("/api/session/1/participate/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    public void testNoLongerParticipate() throws Exception {
        mockMvc.perform(delete("/api/session/1/participate/1"))
                .andExpect(status().isOk());
    }
}
