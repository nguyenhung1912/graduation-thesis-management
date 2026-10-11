package com.soa.report_service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ThesisDTO {

    private String id;
    private String title;
    private String instructor;
    private Integer maxStudents;
    private Integer currentStudents;
    public boolean isFull() {
        return currentStudents != null && maxStudents != null && currentStudents >= maxStudents;
    }
}
