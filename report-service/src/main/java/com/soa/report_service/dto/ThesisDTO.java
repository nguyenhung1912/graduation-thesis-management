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
    private String description;

    public boolean isFull() {
        return currentStudents != null && maxStudents != null && currentStudents >= maxStudents;
    }

    public int getRemainingSlots() {
        if (maxStudents == null)
            return 0;
        int current = currentStudents != null ? currentStudents : 0;
        return Math.max(0, maxStudents - current);
    }
}
