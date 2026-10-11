package com.soa.thesis_service.service;

import com.soa.thesis_service.dto.ThesisRequestDto;
import com.soa.thesis_service.dto.ThesisResponseDto;
import java.util.List;

public interface ThesisService {
    List<ThesisResponseDto> getAllTheses();

    ThesisResponseDto getThesisById(String id);

    ThesisResponseDto createThesis(ThesisRequestDto requestDto);

    ThesisResponseDto updateThesis(String id, ThesisRequestDto requestDto);

    void deleteThesis(String id);

    boolean checkAvailability(String id);

    boolean registerStudent(String id);
}