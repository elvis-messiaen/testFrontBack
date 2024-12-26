package com.openclassrooms.starterjwt.repository;

import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import org.mockito.Mock;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class TeacherRepositoryTest {

    @Mock
    private TeacherRepository teacherRepository;

    @Test
    public void testFindById() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setLastName("Nom");
        teacher.setFirstName("Prenom");

        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));

        Optional<Teacher> foundTeacher = teacherRepository.findById(1L);
        assertThat(foundTeacher).isPresent();
        assertThat(foundTeacher.get().getId()).isEqualTo(1L);
    }

    @Test
    public void testExistsById() {
        when(teacherRepository.existsById(1L)).thenReturn(true);

        Boolean exists = teacherRepository.existsById(1L);
        assertThat(exists).isTrue();
    }
}
