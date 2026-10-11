package com.soa.report_service.util;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class PdfLayoutHelper {

    private final PdfFontHelper fontHelper;

    public void addAdministrativeHeader(Document document, String schoolName, String facultyName)
            throws DocumentException {
        PdfPTable headerTable = new PdfPTable(2);
        headerTable.setWidthPercentage(100);
        headerTable.setWidths(new float[] { 45f, 55f });
        headerTable.setSpacingAfter(15f);

        // Cột bên trái: Cơ quan chủ quản & Trường / Khoa
        PdfPCell leftCell = new PdfPCell();
        leftCell.setBorder(PdfPCell.NO_BORDER);
        leftCell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Paragraph p1 = new Paragraph("BỘ GIÁO DỤC VÀ ĐÀO TẠO", fontHelper.getSmallFont());
        p1.setAlignment(Element.ALIGN_CENTER);
        leftCell.addElement(p1);

        Paragraph p2 = new Paragraph(schoolName != null ? schoolName : "TRƯỜNG ĐẠI HỌC QUY NHƠN",
                fontHelper.getSmallBoldFont());
        p2.setAlignment(Element.ALIGN_CENTER);
        leftCell.addElement(p2);

        Paragraph p3 = new Paragraph(facultyName != null ? facultyName : "KHOA CÔNG NGHỆ THÔNG TIN",
                fontHelper.getSmallBoldFont());
        p3.setAlignment(Element.ALIGN_CENTER);
        leftCell.addElement(p3);

        Paragraph pLine = new Paragraph("-------------------", fontHelper.getSmallFont());
        pLine.setAlignment(Element.ALIGN_CENTER);
        leftCell.addElement(pLine);

        // Cột bên phải: Quốc hiệu & Tiêu ngữ
        PdfPCell rightCell = new PdfPCell();
        rightCell.setBorder(PdfPCell.NO_BORDER);
        rightCell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Paragraph p4 = new Paragraph("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", fontHelper.getSmallBoldFont());
        p4.setAlignment(Element.ALIGN_CENTER);
        rightCell.addElement(p4);

        Paragraph p5 = new Paragraph("Độc lập - Tự do - Hạnh phúc", fontHelper.getSmallBoldFont());
        p5.setAlignment(Element.ALIGN_CENTER);
        rightCell.addElement(p5);

        Paragraph p6 = new Paragraph("-------------------------", fontHelper.getSmallFont());
        p6.setAlignment(Element.ALIGN_CENTER);
        rightCell.addElement(p6);

        headerTable.addCell(leftCell);
        headerTable.addCell(rightCell);

        document.add(headerTable);
    }

    public void addSignatureSection(
            Document document,
            String leftRole,
            String leftName,
            String rightRole,
            String rightName) throws DocumentException {
        LocalDate now = LocalDate.now();
        String dateString = String.format("Gia Lai, ngày %02d tháng %02d năm %d",
                now.getDayOfMonth(), now.getMonthValue(), now.getYear());

        PdfPTable signTable = new PdfPTable(2);
        signTable.setWidthPercentage(100);
        signTable.setWidths(new float[] { 50f, 50f });
        signTable.setSpacingBefore(15f);

        // Left
        PdfPCell leftCell = new PdfPCell();
        leftCell.setBorder(PdfPCell.NO_BORDER);
        leftCell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Paragraph pEmpty = new Paragraph(" ", fontHelper.getSmallItalicFont());
        leftCell.addElement(pEmpty);

        Paragraph pLeftRole = new Paragraph(leftRole, fontHelper.getSmallBoldFont());
        pLeftRole.setAlignment(Element.ALIGN_CENTER);
        leftCell.addElement(pLeftRole);

        Paragraph pLeftSub = new Paragraph("(Ký và ghi rõ họ tên)", fontHelper.getSmallItalicFont());
        pLeftSub.setAlignment(Element.ALIGN_CENTER);
        leftCell.addElement(pLeftSub);

        // Space
        Paragraph pLeftSpace = new Paragraph("\n\n\n", fontHelper.getSmallFont());
        leftCell.addElement(pLeftSpace);

        Paragraph pLeftName = new Paragraph(leftName != null ? leftName : "(Chưa ký)", fontHelper.getSmallBoldFont());
        pLeftName.setAlignment(Element.ALIGN_CENTER);
        leftCell.addElement(pLeftName);

        // Right
        PdfPCell rightCell = new PdfPCell();
        rightCell.setBorder(PdfPCell.NO_BORDER);
        rightCell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Paragraph pDate = new Paragraph(dateString, fontHelper.getSmallItalicFont());
        pDate.setAlignment(Element.ALIGN_CENTER);
        rightCell.addElement(pDate);

        Paragraph pRightRole = new Paragraph(rightRole, fontHelper.getSmallBoldFont());
        pRightRole.setAlignment(Element.ALIGN_CENTER);
        rightCell.addElement(pRightRole);

        Paragraph pRightSub = new Paragraph("(Ký và ghi rõ họ tên)", fontHelper.getSmallItalicFont());
        pRightSub.setAlignment(Element.ALIGN_CENTER);
        rightCell.addElement(pRightSub);

        Paragraph pRightSpace = new Paragraph("\n\n\n", fontHelper.getSmallFont());
        rightCell.addElement(pRightSpace);

        Paragraph pRightName = new Paragraph(rightName != null ? rightName : "(Chưa ký)",
                fontHelper.getSmallBoldFont());
        pRightName.setAlignment(Element.ALIGN_CENTER);
        rightCell.addElement(pRightName);

        signTable.addCell(leftCell);
        signTable.addCell(rightCell);

        document.add(signTable);
    }

    public PdfPCell createHeaderCell(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, fontHelper.getSmallBoldFont()));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setBackgroundColor(new Color(243, 244, 246)); // light gray zinc-100
        cell.setPadding(6f);
        cell.setBorderColor(new Color(209, 213, 219)); // zinc-300
        return cell;
    }

    public PdfPCell createDataCell(String text, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "", fontHelper.getSmallFont()));
        cell.setHorizontalAlignment(alignment);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(5f);
        cell.setBorderColor(new Color(229, 231, 235)); // zinc-200
        return cell;
    }
}
