
package com.soa.registration_service.dto;

public class RegistrationResponse {

    private Long id;
    private String studentId;
    private String thesisId;
    private String status;

    public RegistrationResponse() {
    }

    public RegistrationResponse(
            Long id,
            String studentId,
            String thesisId,
            String status) {
        this.id = id;
        this.studentId = studentId;
        this.thesisId = thesisId;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getThesisId() {
        return thesisId;
    }

    public String getStatus() {
        return status;
    }
}
