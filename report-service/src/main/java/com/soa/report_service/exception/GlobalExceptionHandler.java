package com.soa.report_service.exception;

import feign.FeignException;
import feign.RetryableException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Lỗi không tìm thấy tài nguyên: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(FeignException.NotFound.class)
    public ResponseEntity<Map<String, Object>> handleFeignNotFound(FeignException.NotFound ex) {
        log.warn("thesis-service báo không tìm thấy đề tài: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.NOT_FOUND, "Đề tài không tồn tại trong hệ thống thesis-service");
    }

    @ExceptionHandler(RetryableException.class)
    public ResponseEntity<Map<String, Object>> handleRetryable(RetryableException ex) {
        log.error("Không thể kết nối đến thesis-service: {}", ex.getMessage());
        return buildErrorResponse(
                HttpStatus.SERVICE_UNAVAILABLE,
                "thesis-service hiện đang ngoại tuyến hoặc không phản hồi. Vui lòng kiểm tra lại dịch vụ.");
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<Map<String, Object>> handleGenericFeign(FeignException ex) {
        log.error("Lỗi giao tiếp liên dịch vụ qua OpenFeign: {}", ex.getMessage());
        return buildErrorResponse(
                HttpStatus.BAD_GATEWAY,
                "Lỗi giao tiếp với thesis-service (Mã HTTP: " + ex.status() + ")");
    }

    @ExceptionHandler(PdfGenerationException.class)
    public ResponseEntity<Map<String, Object>> handlePdfGeneration(PdfGenerationException ex) {
        log.error("Lỗi sinh tài liệu PDF: {}", ex.getMessage(), ex);
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex) {
        log.error("Lỗi hệ thống ngoài dự kiến: {}", ex.getMessage(), ex);
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi nội bộ hệ thống: " + ex.getMessage());
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("service", "report-service");
        return new ResponseEntity<>(body, status);
    }
}
