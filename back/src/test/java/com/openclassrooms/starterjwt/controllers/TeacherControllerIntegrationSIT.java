package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class TeacherControllerIntegrationSIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TeacherService teacherService;

    @MockBean
    private TeacherMapper teacherMapper;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @WithMockUser
    public void testFindById_TeacherExists() throws Exception {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("Firstname1");
        teacher.setLastName("Lastname1");

        TeacherDto teacherDto = new TeacherDto();
        teacherDto.setId(1L);
        teacherDto.setFirstName("Firstname1");
        teacherDto.setLastName("Lastname1");

        when(teacherService.findById(1L)).thenReturn(teacher);
        when(teacherMapper.toDto(teacher)).thenReturn(teacherDto);

        mockMvc.perform(get("/api/teacher/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.firstName").value("Firstname1"))
                .andExpect(jsonPath("$.lastName").value("Lastname1"));
    }

    @Test
    @WithMockUser
    public void testFindById_TeacherNotFound() throws Exception {
        when(teacherService.findById(1L)).thenReturn(null);

        mockMvc.perform(get("/api/teacher/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    public void testFindAll() throws Exception {
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        teacher1.setFirstName("Firstname1");
        teacher1.setLastName("Lastname1");

        Teacher teacher2 = new Teacher();
        teacher2.setId(2L);
        teacher2.setFirstName("Firstname2");
        teacher2.setLastName("Lastname2");

        List<Teacher> teachers = Arrays.asList(teacher1, teacher2);

        TeacherDto teacherDto1 = new TeacherDto();
        teacherDto1.setId(1L);
        teacherDto1.setFirstName("Firstname1");
        teacherDto1.setLastName("Lastname1");

        TeacherDto teacherDto2 = new TeacherDto();
        teacherDto2.setId(2L);
        teacherDto2.setFirstName("Firstname2");
        teacherDto2.setLastName("Lastname2");

        List<TeacherDto> teacherDtos = Arrays.asList(teacherDto1, teacherDto2);

        when(teacherService.findAll()).thenReturn(teachers);
        when(teacherMapper.toDto(teachers)).thenReturn(teacherDtos);

        mockMvc.perform(get("/api/teacher"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].firstName").value("Firstname1"))
                .andExpect(jsonPath("$[0].lastName").value("Lastname1"))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].firstName").value("Firstname2"))
                .andExpect(jsonPath("$[1].lastName").value("Lastname2"));
    }
}
