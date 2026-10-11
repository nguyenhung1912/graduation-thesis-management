package com.soa.student_service.service;

import java.util.List;

import com.soa.student_service.entity.Student;

public interface StudentService {
    List<Student> getAllStudents();

    Student getStudentById(String studentId);

    Student createStudent(Student student);

    Student updateStudent(String studentId, Student studentDetails);

    void deleteStudent(String studentId);
}