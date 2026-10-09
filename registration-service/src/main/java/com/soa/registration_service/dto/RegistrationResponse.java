
package com.soa.registration_service.dto;

public class RegistrationResponse {

    private Long id;
    private Long studentId;
    private Long thesisId;
    private String status;

    public RegistrationResponse() {
    }

    public RegistrationResponse(
            Long id,
            Long studentId,
            Long thesisId,
            String status) {
        this.id = id;
        this.studentId = studentId;
        this.thesisId = thesisId;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public Long getThesisId() {
        return thesisId;
    }

    public String getStatus() {
        return status;
    }
}
