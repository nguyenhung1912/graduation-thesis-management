package com.soa.thesis_service.controller;

import com.soa.thesis_service.entity.Thesis;
import com.soa.thesis_service.service.ThesisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/theses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Hỗ trợ frontend React/Angular gọi API
public class ThesisController {

    private final ThesisService thesisService;

    // 1. Lấy danh sách toàn bộ đề tài
    @GetMapping
    public ResponseEntity<List<Thesis>> getAllTheses() {
        return ResponseEntity.ok(thesisService.getAllTheses());
    }

    // 2. Lấy thông tin đề tài theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Thesis> getThesisById(@PathVariable String id) {
        return ResponseEntity.ok(thesisService.getThesisById(id));
    }

    // 3. Tạo đề tài mới
    @PostMapping
    public ResponseEntity<Thesis> createThesis(@RequestBody Thesis thesis) {
        return new ResponseEntity<>(thesisService.createThesis(thesis), HttpStatus.CREATED);
    }

    // 4. Cập nhật thông tin đề tài
    @PutMapping("/{id}")
    public ResponseEntity<Thesis> updateThesis(@PathVariable String id, @RequestBody Thesis thesis) {
        return ResponseEntity.ok(thesisService.updateThesis(id, thesis));
    }

    // 5. Xóa đề tài
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteThesis(@PathVariable String id) {
        thesisService.deleteThesis(id);
        return ResponseEntity.ok(Map.of("message", "Đã xoá đề tài thành công"));
    }

    // 6. API để registration-service bắn Request sang kiểm tra còn slot không
    @GetMapping("/{id}/available")
    public ResponseEntity<Map<String, Object>> checkAvailability(@PathVariable String id) {
        boolean available = thesisService.checkAvailability(id);
        return ResponseEntity.ok(Map.of("thesisId", id, "available", available));
    }

    // 7. API để registration-service gọi tăng số lượng sinh viên đã đăng ký
    @PostMapping("/{id}/register")
    public ResponseEntity<Map<String, Object>> registerStudent(@PathVariable String id) {
        boolean success = thesisService.registerStudent(id);
        return ResponseEntity.ok(Map.of("thesisId", id, "success", success));
    }
}