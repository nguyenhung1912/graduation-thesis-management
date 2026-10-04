package com.soa.thesis_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "DETAI")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Thesis {

    @Id
    @Column(name = "MA_DE_TAI", length = 20, nullable = false, unique = true)
    private String id; // Ví dụ: DT01, DT02

    @Column(name = "TEN_DE_TAI", nullable = false)
    private String title;

    @Column(name = "GIANG_VIEN_HD", nullable = false)
    private String instructor;

    @Column(name = "MAX_STUDENTS", nullable = false)
    private Integer maxStudents;

    @Column(name = "CURRENT_STUDENTS", nullable = false)
    private Integer currentStudents;
}