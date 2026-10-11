package com.soa.report_service.service.impl;

import com.soa.report_service.client.ThesisClient;
import com.soa.report_service.dto.ThesisDTO;
import com.soa.report_service.exception.ResourceNotFoundException;
import com.soa.report_service.service.PdfGeneratorService;
import com.soa.report_service.service.ReportService;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ThesisClient thesisClient;
    private final PdfGeneratorService pdfGeneratorService;

    @Override
    public byte[] exportThesisAssignmentPdf(String thesisId) {
        log.info("ReportService: Tiếp nhận yêu cầu xuất phiếu giao đề tài: {}", thesisId);
        try {
            ThesisDTO thesis = thesisClient.getThesisById(thesisId);
            if (thesis == null) {
                throw new ResourceNotFoundException("Không tìm thấy thông tin đề tài có mã: " + thesisId);
            }
            return pdfGeneratorService.generateThesisAssignmentPdf(thesis);
        } catch (FeignException.NotFound e) {
            log.warn("thesis-service phản hồi 404 cho đề tài ID: {}", thesisId);
            throw new ResourceNotFoundException(
                    "Đề tài không tồn tại trong hệ thống thesis-service (ID: " + thesisId + ")");
        }
    }

    @Override
    public byte[] exportThesisSummaryPdf() {
        log.info("ReportService: Tiếp nhận yêu cầu xuất báo cáo tổng hợp danh sách đề tài toàn khoa.");
        List<ThesisDTO> theses = thesisClient.getAllTheses();
        if (theses == null) {
            theses = List.of();
        }
        return pdfGeneratorService.generateThesisSummaryPdf(theses);
    }
}
