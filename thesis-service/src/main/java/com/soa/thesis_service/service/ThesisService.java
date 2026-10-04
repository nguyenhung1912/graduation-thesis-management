package com.soa.thesis_service.service;

import com.soa.thesis_service.entity.Thesis;
import java.util.List;

public interface ThesisService {
    List<Thesis> getAllTheses();

    Thesis getThesisById(String id);

    Thesis createThesis(Thesis thesis);

    Thesis updateThesis(String id, Thesis thesis);

    void deleteThesis(String id);

    // Nghiệp vụ liên kết cho registration-service gọi qua REST
    boolean checkAvailability(String id);

    boolean registerStudent(String id);
}