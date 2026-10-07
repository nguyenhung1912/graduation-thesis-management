package com.soa.thesis_service.config;

import com.soa.thesis_service.entity.Thesis;
import com.soa.thesis_service.repository.ThesisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ThesisRepository thesisRepository;

    @Override
    public void run(String... args) {
        if (thesisRepository.count() == 0) {
            thesisRepository.save(Thesis.builder().id("DT01").title("Xây dựng hệ thống SOA với Spring Boot")
                    .instructor("TS. Nguyễn Văn A").maxStudents(3).currentStudents(1).build());
            thesisRepository.save(Thesis.builder().id("DT02").title("Nghiên cứu kiến trúc Microservices")
                    .instructor("ThS. Trần Thị B").maxStudents(2).currentStudents(2).build());
            thesisRepository.save(Thesis.builder().id("DT03").title("Phát triển ứng dụng Web phân tán")
                    .instructor("TS. Lê Văn C").maxStudents(4).currentStudents(0).build());
        }
    }
}