package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
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
public class TeacherServiceIntegrationSIT {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    @Test
    public void testFindAll() {
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        teacher1.setLastName("Nom1");
        teacher1.setFirstName("Prenom1");

        Teacher teacher2 = new Teacher();
        teacher2.setId(2L);
        teacher2.setLastName("Nom2");
        teacher2.setFirstName("Prenom2");

        when(teacherRepository.findAll()).thenReturn(Arrays.asList(teacher1, teacher2));

        List<Teacher> teachers = teacherService.findAll();

        assertThat(teachers).hasSize(2);
        assertThat(teachers.get(0).getId()).isEqualTo(1L);
        assertThat(teachers.get(1).getId()).isEqualTo(2L);
    }

    @Test
    public void testFindById() {
        Long teacherId = 1L;
        Teacher teacher = new Teacher();
        teacher.setId(teacherId);
        teacher.setLastName("Nom");
        teacher.setFirstName("Prenom");

        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(teacher));

        Teacher foundTeacher = teacherService.findById(teacherId);

        assertThat(foundTeacher).isNotNull();
        assertThat(foundTeacher.getId()).isEqualTo(teacherId);
        assertThat(foundTeacher.getLastName()).isEqualTo("Nom");
    }

    @Test
    public void testFindByIdNotFound() {
        Long teacherId = 1L;

        when(teacherRepository.findById(teacherId)).thenReturn(Optional.empty());

        Teacher foundTeacher = teacherService.findById(teacherId);

        assertThat(foundTeacher).isNull();
    }
}
