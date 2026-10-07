package com.soa.thesis_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThesisResponseDto {
    private String id;
    private String title;
    private String instructor;
    private Integer maxStudents;
    private Integer currentStudents;
}