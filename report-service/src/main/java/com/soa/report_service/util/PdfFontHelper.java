package com.soa.report_service.util;

import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.pdf.BaseFont;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.io.File;

@Slf4j
@Component
public class PdfFontHelper {

    private BaseFont regularBaseFont;
    private BaseFont boldBaseFont;
    private BaseFont italicBaseFont;
    private BaseFont boldItalicBaseFont;

    public PdfFontHelper() {
        initFonts();
    }

    private void initFonts() {
        String[] regularCandidates = {
                "C:/Windows/Fonts/times.ttf",
                "C:/Windows/Fonts/arial.ttf",
                "/usr/share/fonts/truetype/msttcorefonts/times.ttf",
                "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
        };
        String[] boldCandidates = {
                "C:/Windows/Fonts/timesbd.ttf",
                "C:/Windows/Fonts/arialbd.ttf",
                "/usr/share/fonts/truetype/msttcorefonts/timesbd.ttf",
                "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
        };
        String[] italicCandidates = {
                "C:/Windows/Fonts/timesi.ttf",
                "C:/Windows/Fonts/ariali.ttf",
                "/usr/share/fonts/truetype/msttcorefonts/timesi.ttf",
                "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf"
        };
        String[] boldItalicCandidates = {
                "C:/Windows/Fonts/timesbi.ttf",
                "C:/Windows/Fonts/arialbi.ttf",
                "/usr/share/fonts/truetype/msttcorefonts/timesbi.ttf",
                "/usr/share/fonts/truetype/dejavu/DejaVuSerif-BoldItalic.ttf"
        };

        regularBaseFont = tryLoadBaseFont(regularCandidates);
        boldBaseFont = tryLoadBaseFont(boldCandidates);
        italicBaseFont = tryLoadBaseFont(italicCandidates);
        boldItalicBaseFont = tryLoadBaseFont(boldItalicCandidates);

        if (regularBaseFont != null) {
            log.info("PdfFontHelper: Đã nạp thành công Font Unicode tiếng Việt chuẩn.");
        } else {
            log.warn("PdfFontHelper: Không tìm thấy Font Unicode hệ thống, sử dụng fallback FontFactory.");
        }
    }

    private BaseFont tryLoadBaseFont(String[] candidates) {
        for (String path : candidates) {
            File file = new File(path);
            if (file.exists()) {
                try {
                    return BaseFont.createFont(path, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
                } catch (Exception e) {
                    log.warn("Lỗi khi nạp font từ {}: {}", path, e.getMessage());
                }
            }
        }
        try {
            return BaseFont.createFont(BaseFont.TIMES_ROMAN, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        } catch (Exception e) {
            log.error("Lỗi khi nạp font fallback: {}", e.getMessage());
            return null;
        }
    }

    public Font getRegularFont(float size) {
        return regularBaseFont != null
                ? new Font(regularBaseFont, size, Font.NORMAL, Color.BLACK)
                : FontFactory.getFont(FontFactory.TIMES_ROMAN, size, Font.NORMAL, Color.BLACK);
    }

    public Font getBoldFont(float size) {
        return boldBaseFont != null
                ? new Font(boldBaseFont, size, Font.NORMAL, Color.BLACK)
                : (regularBaseFont != null
                        ? new Font(regularBaseFont, size, Font.BOLD, Color.BLACK)
                        : FontFactory.getFont(FontFactory.TIMES_ROMAN, size, Font.BOLD, Color.BLACK));
    }

    public Font getItalicFont(float size) {
        return italicBaseFont != null
                ? new Font(italicBaseFont, size, Font.NORMAL, Color.BLACK)
                : (regularBaseFont != null
                        ? new Font(regularBaseFont, size, Font.ITALIC, Color.BLACK)
                        : FontFactory.getFont(FontFactory.TIMES_ROMAN, size, Font.ITALIC, Color.BLACK));
    }

    public Font getBoldItalicFont(float size) {
        return boldItalicBaseFont != null
                ? new Font(boldItalicBaseFont, size, Font.NORMAL, Color.BLACK)
                : (boldBaseFont != null
                        ? new Font(boldBaseFont, size, Font.ITALIC, Color.BLACK)
                        : FontFactory.getFont(FontFactory.TIMES_ROMAN, size, Font.BOLDITALIC, Color.BLACK));
    }

    public Font getTitleFont() {
        return getBoldFont(15);
    }

    public Font getSectionFont() {
        return getBoldFont(12);
    }

    public Font getBodyFont() {
        return getRegularFont(11);
    }

    public Font getBodyBoldFont() {
        return getBoldFont(11);
    }

    public Font getBodyItalicFont() {
        return getItalicFont(11);
    }

    public Font getSmallFont() {
        return getRegularFont(9.5f);
    }

    public Font getSmallItalicFont() {
        return getItalicFont(9.5f);
    }

    public Font getSmallBoldFont() {
        return getBoldFont(9.5f);
    }
}
