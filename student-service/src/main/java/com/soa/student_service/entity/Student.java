package com.soa.student_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "SINHVIEN")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @Column(name = "MA_SV", length = 20, nullable = false, unique = true)
    private String studentId;

    @Column(name = "TEN_SV", nullable = false)
    private String fullName;

    @Column(name = "LOP", nullable = false)
    private String className;

    @Column(name = "EMAIL", nullable = false)
    private String email;

    @Column(name = "GPA", nullable = false)
    private Double gpa;

    @Column(name = "DA_DU_DIEU_KIEN", nullable = false)
    private Boolean eligibleForDefense;
}
