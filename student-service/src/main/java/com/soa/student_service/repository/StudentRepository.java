package com.soa.student_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.soa.student_service.entity.Student;

public interface StudentRepository extends JpaRepository<Student, String> {
}
