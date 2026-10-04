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
            thesisRepository
                    .save(new Thesis("DT01", "Xây dựng hệ thống SOA với Spring Boot", "TS. Nguyễn Văn A", 3, 1));
            thesisRepository.save(new Thesis("DT02", "Nghiên cứu kiến trúc Microservices", "ThS. Trần Thị B", 2, 2));
            thesisRepository.save(new Thesis("DT03", "Phát triển ứng dụng Web phân tán", "TS. Lê Văn C", 4, 0));
        }
    }
}