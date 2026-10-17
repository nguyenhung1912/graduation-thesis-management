package com.soa.registration_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class StatusUpdateRequest {

    @NotBlank(message = "Status không được để trống")
    @Pattern(
            regexp = "Chờ duyệt|Đã đăng ký|Đã duyệt|Từ chối|Đã hủy",
            message = "Status chỉ nhận: Chờ duyệt, Đã đăng ký, Đã duyệt, Từ chối, Đã hủy")
    private String status;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
