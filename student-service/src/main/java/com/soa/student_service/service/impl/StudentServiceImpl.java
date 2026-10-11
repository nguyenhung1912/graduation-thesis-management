package com.soa.student_service.service.impl;

import com.soa.student_service.entity.Student;
import com.soa.student_service.repository.StudentRepository;
import com.soa.student_service.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student getStudentById(String studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sinh viên ID: " + studentId));
    }

    @Override
    @Transactional
    public Student createStudent(Student student) {
        if (student.getStudentId() == null || student.getStudentId().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã sinh viên không được để trống");
        }
        if (studentRepository.existsById(student.getStudentId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Sinh viên đã tồn tại với ID: " + student.getStudentId());
        }
        return studentRepository.save(student);
    }

    @Override
    @Transactional
    public Student updateStudent(String studentId, Student studentDetails) {
        Student existingStudent = getStudentById(studentId);
        existingStudent.setFullName(studentDetails.getFullName());
        existingStudent.setClassName(studentDetails.getClassName());
        existingStudent.setEmail(studentDetails.getEmail());
        existingStudent.setGpa(studentDetails.getGpa());
        existingStudent.setEligible(studentDetails.isEligible());
        return studentRepository.save(existingStudent);
    }

    @Override
    @Transactional
    public void deleteStudent(String studentId) {
        Student existingStudent = getStudentById(studentId);
        studentRepository.delete(existingStudent);
    }
}