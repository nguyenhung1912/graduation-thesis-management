package com.soa.report_service.service;

public interface ReportService {
    byte[] exportThesisAssignmentPdf(String thesisId);

    byte[] exportThesisSummaryPdf();
}
