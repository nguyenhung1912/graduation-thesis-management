
package com.soa.registration_service.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

public class RegistrationRequest {

    @NotNull(message = "Student ID không được để trống")
    private Long studentId;

    @NotNull(message = "Thesis ID không được để trống")
    private Long thesisId;

    @NotBlank(message = "Status không được để trống")
    private String status;

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getThesisId() {
        return thesisId;
    }

    public void setThesisId(Long thesisId) {
        this.thesisId = thesisId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
