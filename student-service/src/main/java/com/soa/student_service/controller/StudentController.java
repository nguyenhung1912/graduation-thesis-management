package com.soa.student_service.controller;

import com.soa.student_service.dto.StudentDTO;
import com.soa.student_service.entity.Student;
import com.soa.student_service.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    private StudentDTO mapToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setStudentId(student.getStudentId());
        dto.setFullName(student.getFullName());
        dto.setClassName(student.getClassName());
        dto.setEmail(student.getEmail());
        dto.setGpa(student.getGpa());
        dto.setEligible(student.isEligible());
        return dto;
    }

    private Student mapToEntity(StudentDTO dto) {
        Student student = new Student();
        student.setStudentId(dto.getStudentId());
        student.setFullName(dto.getFullName());
        student.setClassName(dto.getClassName());
        student.setEmail(dto.getEmail());
        student.setGpa(dto.getGpa());
        student.setEligible(dto.isEligible());
        return student;
    }

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        List<StudentDTO> students = studentService.getAllStudents().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable("id") String id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(mapToDTO(student));
    }

    @PostMapping
    public ResponseEntity<StudentDTO> createStudent(@Valid @RequestBody StudentDTO studentDTO) {
        Student student = mapToEntity(studentDTO);
        Student createdStudent = studentService.createStudent(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(createdStudent));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable("id") String id, @Valid @RequestBody StudentDTO studentDTO) {
        Student student = mapToEntity(studentDTO);
        Student updatedStudent = studentService.updateStudent(id, student);
        return ResponseEntity.ok(mapToDTO(updatedStudent));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable("id") String id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/eligibility")
    public ResponseEntity<Map<String, Object>> checkEligibility(@PathVariable("id") String studentId) {
        Student student = studentService.getStudentById(studentId);
        return ResponseEntity.ok(Map.of(
                "studentId", student.getStudentId(),
                "eligible", student.isEligible(),
                "gpa", student.getGpa()
        ));
    }
}