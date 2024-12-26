package com.openclassrooms.starterjwt.repository;

import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class TeacherRepositoryIntegrationSIT {

    @Autowired
    private TeacherRepository teacherRepository;

    @Test
    public void testFindById_ShouldReturnTeacher_WhenTeacherExists() {
        Teacher teacher = new Teacher();
        teacher.setLastName("Nom");
        teacher.setFirstName("Prenom");

        Teacher savedTeacher = teacherRepository.save(teacher);

        Optional<Teacher> foundTeacher = teacherRepository.findById(savedTeacher.getId());

        assertThat(foundTeacher).isPresent();
        assertThat(foundTeacher.get().getId()).isEqualTo(savedTeacher.getId());
        assertThat(foundTeacher.get().getLastName()).isEqualTo("Nom");
        assertThat(foundTeacher.get().getFirstName()).isEqualTo("Prenom");
    }

    @Test
    public void testExistsById_ShouldReturnTrue_WhenTeacherExists() {
        Teacher teacher = new Teacher();
        teacher.setLastName("Nom");
        teacher.setFirstName("Prenom");

        Teacher savedTeacher = teacherRepository.save(teacher);

        Boolean exists = teacherRepository.existsById(savedTeacher.getId());

        assertThat(exists).isTrue();
    }
}