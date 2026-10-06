package com.soa.student_service.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StudentDTO {
    @NotBlank(message = "Mã sinh viên không được để trống")
    private String studentId;
    
    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;
    
    @NotBlank(message = "Lớp không được để trống")
    private String className;
    
    private String email;
    
    @Min(value = 0, message = "GPA tối thiểu là 0")
    @Max(value = 4, message = "GPA tối đa là 4.0")
    private Double gpa;
    
    private boolean eligible;
}