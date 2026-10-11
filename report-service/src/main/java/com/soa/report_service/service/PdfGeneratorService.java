package com.soa.report_service.service;

import com.soa.report_service.dto.ThesisDTO;

import java.util.List;

public interface PdfGeneratorService {
    byte[] generateThesisAssignmentPdf(ThesisDTO thesis);

    byte[] generateThesisSummaryPdf(List<ThesisDTO> theses);
}
