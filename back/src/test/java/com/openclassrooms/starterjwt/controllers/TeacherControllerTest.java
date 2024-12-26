package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.Arrays;
import java.util.List;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class TeacherControllerTest {

    @Mock
    private TeacherService teacherService;

    @Mock
    private TeacherMapper teacherMapper;

    @InjectMocks
    private TeacherController teacherController;

    private MockMvc mockMvc;

    @Test
    public void testFindById_TeacherExists() throws Exception {
        Teacher teacher = new Teacher();
        teacher.setId(1L);

        TeacherDto teacherDto = new TeacherDto();
        teacherDto.setId(1L);

        when(teacherService.findById(1L)).thenReturn(teacher);
        when(teacherMapper.toDto(teacher)).thenReturn(teacherDto);

        mockMvc = MockMvcBuilders.standaloneSetup(teacherController).build();

        mockMvc.perform(get("/api/teacher/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    public void testFindById_TeacherNotFound() throws Exception {
        when(teacherService.findById(1L)).thenReturn(null);

        mockMvc = MockMvcBuilders.standaloneSetup(teacherController).build();

        mockMvc.perform(get("/api/teacher/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testFindById_InvalidId() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(teacherController).build();

        mockMvc.perform(get("/api/teacher/invalidId"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testFindAll() throws Exception {
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);

        Teacher teacher2 = new Teacher();
        teacher2.setId(2L);

        List<Teacher> teachers = Arrays.asList(teacher1, teacher2);

        TeacherDto teacherDto1 = new TeacherDto();
        teacherDto1.setId(1L);

        TeacherDto teacherDto2 = new TeacherDto();
        teacherDto2.setId(2L);

        List<TeacherDto> teacherDtos = Arrays.asList(teacherDto1, teacherDto2);

        when(teacherService.findAll()).thenReturn(teachers);
        when(teacherMapper.toDto(teachers)).thenReturn(teacherDtos);

        mockMvc = MockMvcBuilders.standaloneSetup(teacherController).build();

        mockMvc.perform(get("/api/teacher"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[1].id").value(2L));
    }
}
