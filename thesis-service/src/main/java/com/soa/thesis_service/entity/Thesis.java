package com.soa.thesis_service.entity;

import jakarta.persistence.*;
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
    private String id;

    @Column(name = "TEN_DE_TAI", nullable = false)
    private String title;

    @Column(name = "GIANG_VIEN_HD", nullable = false)
    private String instructor;

    @Column(name = "MAX_STUDENTS", nullable = false)
    private Integer maxStudents;

    @Column(name = "CURRENT_STUDENTS", nullable = false)
    private Integer currentStudents;

    // Trường phiên bản chống Race Condition bằng cơ chế Optimistic Locking
    @Version
    @Column(name = "VERSION")
    private Long version;
}