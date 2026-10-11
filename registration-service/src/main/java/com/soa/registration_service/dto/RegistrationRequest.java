
package com.soa.registration_service.dto;

import jakarta.validation.constraints.NotBlank;

public class RegistrationRequest {

    @NotBlank(message = "Student ID không được để trống")
    private String studentId;

    @NotBlank(message = "Thesis ID không được để trống")
    private String thesisId;

    @NotBlank(message = "Status không được để trống")
    private String status;

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getThesisId() {
        return thesisId;
    }

    public void setThesisId(String thesisId) {
        this.thesisId = thesisId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
