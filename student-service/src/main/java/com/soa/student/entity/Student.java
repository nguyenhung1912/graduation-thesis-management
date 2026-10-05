package com.soa.student.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "SINHVIEN")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    
    @Id
    private String studentId;
    
    private String fullName;
    
    private String className;
    
    private String email;
    
    private Double gpa;
    
    private Boolean eligibleForDefense;
}
