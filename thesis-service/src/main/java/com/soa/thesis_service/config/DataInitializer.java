package com.soa.thesis_service.config;

import com.soa.thesis_service.entity.Thesis;
import com.soa.thesis_service.repository.ThesisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ThesisRepository thesisRepository;

    @Override
    public void run(String... args) {
        if (thesisRepository.count() == 0) {
            thesisRepository.saveAll(List.of(
                Thesis.builder()
                    .id("DT01")
                    .title("Xây dựng hệ thống SOA với Spring Boot & Event-Driven Architecture")
                    .instructor("TS. Nguyễn Văn A")
                    .maxStudents(3)
                    .currentStudents(2)
                    .build(),
                Thesis.builder()
                    .id("DT02")
                    .title("Nghiên cứu kiến trúc Microservices và Kubernetes Service Mesh")
                    .instructor("ThS. Trần Thị B")
                    .maxStudents(2)
                    .currentStudents(2)
                    .build(),
                Thesis.builder()
                    .id("DT03")
                    .title("Phát triển ứng dụng Web phân tán thời gian thực với WebSocket")
                    .instructor("TS. Lê Văn C")
                    .maxStudents(4)
                    .currentStudents(0)
                    .build(),
                Thesis.builder()
                    .id("DT04")
                    .title("Ứng dụng Học sâu (Deep Learning) nhận diện bệnh cây trồng")
                    .instructor("PGS.TS. Huỳnh Quyết Thắng")
                    .maxStudents(2)
                    .currentStudents(1)
                    .build(),
                Thesis.builder()
                    .id("DT05")
                    .title("Hệ thống Giám sát An toàn Thông tin và Phát hiện Xâm nhập SIEM")
                    .instructor("TS. Đỗ Hoàng Sơn")
                    .maxStudents(2)
                    .currentStudents(2)
                    .build(),
                Thesis.builder()
                    .id("DT06")
                    .title("Phân tích dữ liệu lớn và dự báo xu hướng thị trường với Apache Spark")
                    .instructor("PGS.TS. Vũ Tuyết Trinh")
                    .maxStudents(3)
                    .currentStudents(1)
                    .build(),
                Thesis.builder()
                    .id("DT07")
                    .title("Xây dựng ứng dụng Di động đa nền tảng kết hợp AI Assistant")
                    .instructor("ThS. Hoàng Văn Dũng")
                    .maxStudents(2)
                    .currentStudents(1)
                    .build(),
                Thesis.builder()
                    .id("DT08")
                    .title("Ứng dụng Blockchain trong truy xuất nguồn gốc nông sản")
                    .instructor("TS. Nguyễn Hữu Điệp")
                    .maxStudents(2)
                    .currentStudents(0)
                    .build(),
                Thesis.builder()
                    .id("DT09")
                    .title("Nền tảng IoT quan trắc môi trường và cảnh báo thiên tai thông minh")
                    .instructor("TS. Phạm Tuấn Anh")
                    .maxStudents(3)
                    .currentStudents(0)
                    .build(),
                Thesis.builder()
                    .id("DT10")
                    .title("Hệ thống Đề xuất học tập cá nhân hóa sử dụng LLM & RAG")
                    .instructor("PGS.TS. Trịnh Thành Trung")
                    .maxStudents(2)
                    .currentStudents(0)
                    .build()
            ));
        }
    }
}