package com.soa.report_service.client;

import com.soa.report_service.dto.ThesisDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "thesis-service", url = "${services.thesis.url:http://localhost:8082}")
public interface ThesisClient {
    @GetMapping("/api/theses/{id}")
    ThesisDTO getThesisById(@PathVariable("id") String id);

    @GetMapping("/api/theses")
    List<ThesisDTO> getAllTheses();
}
