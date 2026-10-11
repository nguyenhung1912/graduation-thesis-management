package com.soa.report_service.controller;

import com.soa.report_service.exception.GlobalExceptionHandler;
import com.soa.report_service.exception.ResourceNotFoundException;
import com.soa.report_service.service.ReportService;
import feign.Request;
import feign.RequestTemplate;
import feign.RetryableException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.HashMap;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ReportControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ReportService reportService;

    @InjectMocks
    private ReportController reportController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(reportController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("GET /api/reports/theses/{id}/pdf - Thành công trả về file PDF với HTTP 200")
    void testGetThesisAssignmentPdf_Success() throws Exception {
        byte[] mockPdf = new byte[]{37, 80, 68, 70}; // Header %PDF
        when(reportService.exportThesisAssignmentPdf("DT01")).thenReturn(mockPdf);

        mockMvc.perform(get("/api/reports/theses/DT01/pdf"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE))
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"phieu-giao-de-tai-DT01.pdf\""))
                .andExpect(content().bytes(mockPdf));
    }

    @Test
    @DisplayName("GET /api/reports/theses/{id}/pdf - Không tìm thấy đề tài trả về HTTP 404")
    void testGetThesisAssignmentPdf_NotFound() throws Exception {
        when(reportService.exportThesisAssignmentPdf("DT99"))
                .thenThrow(new ResourceNotFoundException("Đề tài không tồn tại trong hệ thống (ID: DT99)"));

        mockMvc.perform(get("/api/reports/theses/DT99/pdf"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Đề tài không tồn tại trong hệ thống (ID: DT99)"))
                .andExpect(jsonPath("$.service").value("report-service"));
    }

    @Test
    @DisplayName("GET /api/reports/theses/summary/pdf - Thành công trả về file PDF tổng hợp")
    void testGetThesisSummaryPdf_Success() throws Exception {
        byte[] mockPdf = new byte[]{37, 80, 68, 70, 45, 49, 46, 52};
        when(reportService.exportThesisSummaryPdf()).thenReturn(mockPdf);

        mockMvc.perform(get("/api/reports/theses/summary/pdf"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE))
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"danh-sach-tong-hop-de-tai.pdf\""))
                .andExpect(content().bytes(mockPdf));
    }

    @Test
    @DisplayName("GET /api/reports/theses/{id}/pdf - thesis-service offline trả về HTTP 503")
    void testGetThesisAssignmentPdf_ServiceUnavailable() throws Exception {
        Request request = Request.create(
                Request.HttpMethod.GET,
                "http://localhost:8082/api/theses/DT01",
                new HashMap<>(),
                Request.Body.empty(),
                new RequestTemplate()
        );
        when(reportService.exportThesisAssignmentPdf("DT01"))
                .thenThrow(new RetryableException(503, "Connection refused", Request.HttpMethod.GET, (Long) null, request));

        mockMvc.perform(get("/api/reports/theses/DT01/pdf"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.status").value(503))
                .andExpect(jsonPath("$.service").value("report-service"));
    }
}
