package com.soa.thesis_service.controller;

import com.soa.thesis_service.dto.ThesisRequestDto;
import com.soa.thesis_service.dto.ThesisResponseDto;
import com.soa.thesis_service.service.ThesisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/theses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ThesisController {

    private final ThesisService thesisService;

    // 1. Lấy danh sách toàn bộ đề tài (đổi List<Thesis> -> List<ThesisResponseDto>)
    @GetMapping
    public ResponseEntity<List<ThesisResponseDto>> getAllTheses() {
        return ResponseEntity.ok(thesisService.getAllTheses());
    }

    // 2. Lấy thông tin đề tài theo ID (đổi Thesis -> ThesisResponseDto)
    @GetMapping("/{id}")
    public ResponseEntity<ThesisResponseDto> getThesisById(@PathVariable String id) {
        return ResponseEntity.ok(thesisService.getThesisById(id));
    }

    // 3. Tạo đề tài mới (nhận vào ThesisRequestDto, trả về ThesisResponseDto)
    @PostMapping
    public ResponseEntity<ThesisResponseDto> createThesis(@Valid @RequestBody ThesisRequestDto requestDto) {
        return new ResponseEntity<>(thesisService.createThesis(requestDto), HttpStatus.CREATED);
    }

    // 4. Cập nhật đề tài
    @PutMapping("/{id}")
    public ResponseEntity<ThesisResponseDto> updateThesis(
            @PathVariable String id,
            @Valid @RequestBody ThesisRequestDto requestDto) {
        return ResponseEntity.ok(thesisService.updateThesis(id, requestDto));
    }

    // 5. Xóa đề tài
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteThesis(@PathVariable String id) {
        thesisService.deleteThesis(id);
        return ResponseEntity.ok(Map.of("message", "Đã xoá đề tài thành công"));
    }

    // 6. API kiểm tra còn slot hay không (cho registration-service)
    @GetMapping("/{id}/available")
    public ResponseEntity<Map<String, Object>> checkAvailability(@PathVariable String id) {
        boolean available = thesisService.checkAvailability(id);
        return ResponseEntity.ok(Map.of("thesisId", id, "available", available));
    }

    // 7. API tăng số lượng đã đăng ký (cho registration-service)
    @PostMapping("/{id}/register")
    public ResponseEntity<Map<String, Object>> registerStudent(@PathVariable String id) {
        boolean success = thesisService.registerStudent(id);
        return ResponseEntity.ok(Map.of("thesisId", id, "success", success));
    }
}