package com.soa.report_service.service.impl;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.soa.report_service.dto.ThesisDTO;
import com.soa.report_service.exception.PdfGenerationException;
import com.soa.report_service.service.PdfGeneratorService;
import com.soa.report_service.util.PdfFontHelper;
import com.soa.report_service.util.PdfLayoutHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PdfGeneratorServiceImpl implements PdfGeneratorService {

    private final PdfFontHelper fontHelper;
    private final PdfLayoutHelper layoutHelper;

    @Override
    public byte[] generateThesisAssignmentPdf(ThesisDTO thesis) {
        log.info("Bắt đầu sinh Phiếu giao nhiệm vụ đồ án cho đề tài: {}", thesis.getId());
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Motto
            layoutHelper.addAdministrativeHeader(document, "TRƯỜNG ĐẠI HỌC QUY NHƠN", "KHOA CÔNG NGHỆ THÔNG TIN");

            // Paragraph Title
            Paragraph title = new Paragraph("PHIẾU GIAO ĐỀ TÀI ĐỒ ÁN TỐT NGHIỆP", fontHelper.getTitleFont());
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(4f);
            document.add(title);

            Paragraph subtitle = new Paragraph("Học kỳ II - Năm học 2025 - 2026", fontHelper.getBodyItalicFont());
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(15f);
            document.add(subtitle);

            // General Thesis Information
            Paragraph sec1 = new Paragraph("I. THÔNG TIN CHUNG VỀ ĐỀ TÀI", fontHelper.getSectionFont());
            sec1.setSpacingAfter(8f);
            document.add(sec1);

            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setWidths(new float[] { 32f, 68f });
            infoTable.setSpacingAfter(12f);

            addTableRow(infoTable, "Mã số đề tài:", thesis.getId() != null ? thesis.getId() : "N/A");
            addTableRow(infoTable, "Tên đề tài:", thesis.getTitle() != null ? thesis.getTitle() : "Chưa đặt tên");
            addTableRow(infoTable, "Giảng viên hướng dẫn:",
                    thesis.getInstructor() != null ? thesis.getInstructor() : "Chưa phân công");
            addTableRow(infoTable, "Số lượng sinh viên tối đa:",
                    (thesis.getMaxStudents() != null ? thesis.getMaxStudents() : 0) + " sinh viên");
            addTableRow(infoTable, "Số lượng đã đăng ký:",
                    (thesis.getCurrentStudents() != null ? thesis.getCurrentStudents() : 0) + " sinh viên");
            addTableRow(infoTable, "Trạng thái tiếp nhận:",
                    thesis.isFull() ? "Đã đủ chỉ tiêu" : "Đang mở tiếp nhận đăng ký");

            document.add(infoTable);

            // Objectives & Requirements of the Thesis
            Paragraph sec2 = new Paragraph("II. MỤC TIÊU VÀ NỘI DUNG THỰC HIỆN", fontHelper.getSectionFont());
            sec2.setSpacingAfter(6f);
            document.add(sec2);

            Paragraph pObj1 = new Paragraph(
                    "1. Mục tiêu: Nghiên cứu, thiết kế và phát triển hệ thống phần mềm dựa trên kiến trúc hướng dịch vụ (Service-Oriented Architecture - SOA).",
                    fontHelper.getBodyFont());
            pObj1.setSpacingAfter(3f);
            document.add(pObj1);

            Paragraph pObj2 = new Paragraph(
                    "2. Yêu cầu kỹ thuật: Xây dựng các web service độc lập, trao đổi dữ liệu qua giao thức chuẩn HTTP/REST, tuân thủ các nguyên lý SOLID, SRP, Loose Coupling.",
                    fontHelper.getBodyFont());
            pObj2.setSpacingAfter(3f);
            document.add(pObj2);

            Paragraph pObj3 = new Paragraph(
                    "3. Kết quả bàn giao: Mã nguồn hệ thống, tài liệu đặc tả API (OpenAPI/Swagger), tài liệu kiến trúc và chương trình demo tương tác qua giao diện web.",
                    fontHelper.getBodyFont());
            pObj3.setSpacingAfter(12f);
            document.add(pObj3);

            Paragraph sec3 = new Paragraph("III. KẾ HOẠCH TIẾN ĐỘ DỰ KIẾN", fontHelper.getSectionFont());
            sec3.setSpacingAfter(8f);
            document.add(sec3);

            PdfPTable scheduleTable = new PdfPTable(3);
            scheduleTable.setWidthPercentage(100);
            scheduleTable.setWidths(new float[] { 18f, 52f, 30f });
            scheduleTable.setSpacingAfter(12f);

            scheduleTable.addCell(layoutHelper.createHeaderCell("Thời gian"));
            scheduleTable.addCell(layoutHelper.createHeaderCell("Nội dung thực hiện"));
            scheduleTable.addCell(layoutHelper.createHeaderCell("Kết quả dự kiến"));

            scheduleTable.addCell(layoutHelper.createDataCell("Tuần 1 - 4", Element.ALIGN_CENTER));
            scheduleTable.addCell(layoutHelper
                    .createDataCell("Khảo sát bài toán, phân tích thiết kế kiến trúc SOA & CSDL", Element.ALIGN_LEFT));
            scheduleTable.addCell(layoutHelper.createDataCell("Bản thiết kế kiến trúc", Element.ALIGN_LEFT));

            scheduleTable.addCell(layoutHelper.createDataCell("Tuần 5 - 9", Element.ALIGN_CENTER));
            scheduleTable.addCell(layoutHelper
                    .createDataCell("Xây dựng các REST Web Services độc lập và nghiệp vụ CRUD", Element.ALIGN_LEFT));
            scheduleTable.addCell(layoutHelper.createDataCell("Dịch vụ chạy ổn định", Element.ALIGN_LEFT));

            scheduleTable.addCell(layoutHelper.createDataCell("Tuần 10 - 13", Element.ALIGN_CENTER));
            scheduleTable.addCell(layoutHelper.createDataCell(
                    "Xây dựng giao diện Client, tích hợp liên dịch vụ qua HTTP/REST", Element.ALIGN_LEFT));
            scheduleTable.addCell(layoutHelper.createDataCell("Hệ thống tích hợp hoàn chỉnh", Element.ALIGN_LEFT));

            scheduleTable.addCell(layoutHelper.createDataCell("Tuần 14 - 15", Element.ALIGN_CENTER));
            scheduleTable.addCell(layoutHelper.createDataCell(
                    "Kiểm thử toàn diện, viết báo cáo và chuẩn bị bảo vệ trước Hội đồng", Element.ALIGN_LEFT));
            scheduleTable.addCell(layoutHelper.createDataCell("Bản báo cáo đồ án", Element.ALIGN_LEFT));

            document.add(scheduleTable);

            layoutHelper.addSignatureSection(
                    document,
                    "GIẢNG VIÊN HƯỚNG DẪN",
                    thesis.getInstructor(),
                    "TRƯỞNG BỘ MÔN / TRƯỞNG KHOA",
                    "TS. Nguyễn Văn A");

            document.close();
            log.info("Hoàn tất sinh Phiếu giao nhiệm vụ đồ án [{}] thành công.", thesis.getId());
            return out.toByteArray();

        } catch (Exception e) {
            log.error("Lỗi khi sinh PDF phiếu giao đề tài [{}]: {}", thesis.getId(), e.getMessage(), e);
            throw new PdfGenerationException("Lỗi trong quá trình tạo tài liệu PDF phiếu giao đề tài", e);
        }
    }

    @Override
    public byte[] generateThesisSummaryPdf(List<ThesisDTO> theses) {
        log.info("Bắt đầu sinh Báo cáo danh sách tổng hợp {} đề tài.", theses.size());
        Document document = new Document(PageSize.A4.rotate(), 30, 30, 30, 30);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            layoutHelper.addAdministrativeHeader(document, "TRƯỜNG ĐẠI HỌC QUY NHƠN", "KHOA CÔNG NGHỆ THÔNG TIN");

            Paragraph title = new Paragraph("DANH SÁCH TỔNG HỢP ĐỀ TÀI ĐỒ ÁN TỐT NGHIỆP", fontHelper.getTitleFont());
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(4f);
            document.add(title);

            Paragraph subtitle = new Paragraph("Hệ thống Quản lý Đồ án - Kiến trúc Hướng dịch vụ (SOA)",
                    fontHelper.getBodyItalicFont());
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(14f);
            document.add(subtitle);

            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);
            table.setWidths(new float[] { 6f, 12f, 38f, 22f, 8f, 8f, 10f });
            table.setSpacingAfter(12f);

            table.addCell(layoutHelper.createHeaderCell("STT"));
            table.addCell(layoutHelper.createHeaderCell("Mã ĐT"));
            table.addCell(layoutHelper.createHeaderCell("Tên đề tài"));
            table.addCell(layoutHelper.createHeaderCell("Giảng viên HD"));
            table.addCell(layoutHelper.createHeaderCell("Chỉ tiêu"));
            table.addCell(layoutHelper.createHeaderCell("Đã ĐK"));
            table.addCell(layoutHelper.createHeaderCell("Trạng thái"));

            int fullCount = 0;
            int totalMax = 0;
            int totalCurrent = 0;

            for (int i = 0; i < theses.size(); i++) {
                ThesisDTO t = theses.get(i);
                int max = t.getMaxStudents() != null ? t.getMaxStudents() : 0;
                int current = t.getCurrentStudents() != null ? t.getCurrentStudents() : 0;
                boolean full = t.isFull();

                totalMax += max;
                totalCurrent += current;
                if (full)
                    fullCount++;

                table.addCell(layoutHelper.createDataCell(String.valueOf(i + 1), Element.ALIGN_CENTER));
                table.addCell(layoutHelper.createDataCell(t.getId(), Element.ALIGN_CENTER));
                table.addCell(layoutHelper.createDataCell(t.getTitle(), Element.ALIGN_LEFT));
                table.addCell(layoutHelper.createDataCell(t.getInstructor(), Element.ALIGN_LEFT));
                table.addCell(layoutHelper.createDataCell(String.valueOf(max), Element.ALIGN_CENTER));
                table.addCell(layoutHelper.createDataCell(String.valueOf(current), Element.ALIGN_CENTER));

                PdfPCell statusCell = layoutHelper.createDataCell(full ? "Đã đủ" : "Còn nhận", Element.ALIGN_CENTER);
                if (full) {
                    statusCell.setBackgroundColor(new Color(254, 242, 242)); // rose-50
                } else {
                    statusCell.setBackgroundColor(new Color(240, 253, 244)); // emerald-50
                }
                table.addCell(statusCell);
            }

            document.add(table);

            PdfPTable statTable = new PdfPTable(2);
            statTable.setWidthPercentage(50);
            statTable.setHorizontalAlignment(Element.ALIGN_LEFT);
            statTable.setWidths(new float[] { 65f, 35f });
            statTable.setSpacingAfter(10f);

            addTableRow(statTable, "Tổng số đề tài:", String.valueOf(theses.size()));
            addTableRow(statTable, "Số đề tài đã đủ sinh viên:", String.valueOf(fullCount));
            addTableRow(statTable, "Số đề tài còn nhận sinh viên:", String.valueOf(theses.size() - fullCount));
            addTableRow(statTable, "Tổng chỉ tiêu sinh viên toàn khoa:", String.valueOf(totalMax));
            addTableRow(statTable, "Tổng số sinh viên đã đăng ký:", String.valueOf(totalCurrent));

            document.add(statTable);

            // Signature
            layoutHelper.addSignatureSection(
                    document,
                    "NGƯỜI LẬP BÁO CÁO",
                    "Thư ký Khoa",
                    "TRƯỞNG KHOA CÔNG NGHỆ THÔNG TIN",
                    "TS. Nguyễn Văn A");

            document.close();
            log.info("Hoàn tất sinh Báo cáo tổng hợp đề tài thành công.");
            return out.toByteArray();

        } catch (Exception e) {
            log.error("Lỗi khi sinh PDF báo cáo tổng hợp: {}", e.getMessage(), e);
            throw new PdfGenerationException("Lỗi trong quá trình tạo tài liệu PDF danh sách tổng hợp", e);
        }
    }

    private void addTableRow(PdfPTable table, String label, String value) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, fontHelper.getSmallBoldFont()));
        labelCell.setPadding(4f);
        labelCell.setBackgroundColor(new Color(249, 250, 251)); // zinc-50
        labelCell.setBorderColor(new Color(229, 231, 235));

        PdfPCell valueCell = new PdfPCell(new Phrase(value, fontHelper.getSmallFont()));
        valueCell.setPadding(4f);
        valueCell.setBorderColor(new Color(229, 231, 235));

        table.addCell(labelCell);
        table.addCell(valueCell);
    }
}
