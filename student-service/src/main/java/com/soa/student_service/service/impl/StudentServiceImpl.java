package com.soa.student_service.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.soa.student_service.entity.Student;
import com.soa.student_service.repository.StudentRepository;
import com.soa.student_service.service.StudentService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(String studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));
    }

    public Student createStudent(Student student) {
        if (student.getStudentId() != null && studentRepository.existsById(student.getStudentId())) {
            throw new RuntimeException("Student already exists with ID: " + student.getStudentId());
        }
        return studentRepository.save(student);
    }

    public Student updateStudent(String studentId, Student studentDetails) {
        Student existingStudent = getStudentById(studentId);

        existingStudent.setFullName(studentDetails.getFullName());
        existingStudent.setClassName(studentDetails.getClassName());
        existingStudent.setEmail(studentDetails.getEmail());
        existingStudent.setGpa(studentDetails.getGpa());
        existingStudent.setEligibleForDefense(studentDetails.getEligibleForDefense());

        return studentRepository.save(existingStudent);
    }

    public void deleteStudent(String studentId) {
        Student existingStudent = getStudentById(studentId);
        studentRepository.delete(existingStudent);
    }
}
