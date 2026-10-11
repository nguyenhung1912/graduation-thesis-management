package com.soa.thesis_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThesisRequestDto {

    @NotBlank(message = "Mã đề tài không được để trống")
    private String id;

    @NotBlank(message = "Tên đề tài không được để trống")
    private String title;

    @NotBlank(message = "Tên giảng viên hướng dẫn không được để trống")
    private String instructor;

    @NotNull(message = "Số lượng sinh viên tối đa không được null")
    @Min(value = 1, message = "Số lượng sinh viên tối đa phải từ 1 trở lên")
    private Integer maxStudents;
}