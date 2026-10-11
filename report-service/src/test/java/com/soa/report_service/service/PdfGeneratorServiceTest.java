package com.soa.report_service.service;

import com.soa.report_service.dto.ThesisDTO;
import com.soa.report_service.service.impl.PdfGeneratorServiceImpl;
import com.soa.report_service.util.PdfFontHelper;
import com.soa.report_service.util.PdfLayoutHelper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PdfGeneratorServiceTest {

    private PdfGeneratorService pdfGeneratorService;

    @BeforeEach
    void setUp() {
        PdfFontHelper fontHelper = new PdfFontHelper();
        PdfLayoutHelper layoutHelper = new PdfLayoutHelper(fontHelper);
        pdfGeneratorService = new PdfGeneratorServiceImpl(fontHelper, layoutHelper);
    }

    @Test
    @DisplayName("generateThesisAssignmentPdf - Sinh file PDF phiếu giao đề tài hợp lệ")
    void testGenerateThesisAssignmentPdf() {
        ThesisDTO thesis = ThesisDTO.builder()
                .id("DT01")
                .title("Nghiên cứu Kiến trúc Hướng dịch vụ (SOA) và Microservices")
                .instructor("TS. Trần Văn Hướng Dẫn")
                .maxStudents(3)
                .currentStudents(1)
                .build();

        byte[] pdfBytes = pdfGeneratorService.generateThesisAssignmentPdf(thesis);

        assertNotNull(pdfBytes, "Dữ liệu byte PDF không được null");
        assertTrue(pdfBytes.length > 500, "File PDF phải có dung lượng lớn hơn 500 bytes");

        // Kiểm tra magic header của file PDF: %PDF
        assertEquals('%', (char) pdfBytes[0]);
        assertEquals('P', (char) pdfBytes[1]);
        assertEquals('D', (char) pdfBytes[2]);
        assertEquals('F', (char) pdfBytes[3]);
    }

    @Test
    @DisplayName("generateThesisSummaryPdf - Sinh file PDF danh sách tổng hợp hợp lệ")
    void testGenerateThesisSummaryPdf() {
        List<ThesisDTO> theses = List.of(
                ThesisDTO.builder().id("DT01").title("Đề tài A").instructor("GV A").maxStudents(3).currentStudents(3).build(),
                ThesisDTO.builder().id("DT02").title("Đề tài B").instructor("GV B").maxStudents(2).currentStudents(1).build()
        );

        byte[] pdfBytes = pdfGeneratorService.generateThesisSummaryPdf(theses);

        assertNotNull(pdfBytes, "Dữ liệu byte PDF không được null");
        assertTrue(pdfBytes.length > 500, "File PDF phải có dung lượng lớn hơn 500 bytes");
        assertEquals('%', (char) pdfBytes[0]);
        assertEquals('P', (char) pdfBytes[1]);
        assertEquals('D', (char) pdfBytes[2]);
        assertEquals('F', (char) pdfBytes[3]);
    }
}
