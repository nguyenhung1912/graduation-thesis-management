package com.soa.thesis_service.service.impl;

import com.soa.thesis_service.dto.ThesisRequestDto;
import com.soa.thesis_service.dto.ThesisResponseDto;
import com.soa.thesis_service.entity.Thesis;
import com.soa.thesis_service.exception.BadRequestException;
import com.soa.thesis_service.exception.ResourceNotFoundException;
import com.soa.thesis_service.repository.ThesisRepository;
import com.soa.thesis_service.service.ThesisService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ThesisServiceImpl implements ThesisService {

    private final ThesisRepository thesisRepository;

    // Chuyển đổi Entity sang Response DTO
    private ThesisResponseDto toResponseDto(Thesis entity) {
        return ThesisResponseDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .instructor(entity.getInstructor())
                .maxStudents(entity.getMaxStudents())
                .currentStudents(entity.getCurrentStudents())
                .build();
    }

    @Override
    public List<ThesisResponseDto> getAllTheses() {
        return thesisRepository.findAll().stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public ThesisResponseDto getThesisById(String id) {
        Thesis thesis = thesisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đề tài mã: " + id));
        return toResponseDto(thesis);
    }

    @Override
    @Transactional
    public ThesisResponseDto createThesis(ThesisRequestDto requestDto) {
        if (thesisRepository.existsById(requestDto.getId())) {
            throw new BadRequestException("Mã đề tài đã tồn tại: " + requestDto.getId());
        }

        Thesis thesis = Thesis.builder()
                .id(requestDto.getId())
                .title(requestDto.getTitle())
                .instructor(requestDto.getInstructor())
                .maxStudents(requestDto.getMaxStudents())
                .currentStudents(0) // Luôn mặc định là 0 khi tạo mới đề tài
                .build();

        return toResponseDto(thesisRepository.save(thesis));
    }

    @Override
    @Transactional
    public ThesisResponseDto updateThesis(String id, ThesisRequestDto requestDto) {
        Thesis existing = thesisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đề tài mã: " + id));

        existing.setTitle(requestDto.getTitle());
        existing.setInstructor(requestDto.getInstructor());
        existing.setMaxStudents(requestDto.getMaxStudents());

        return toResponseDto(thesisRepository.save(existing));
    }

    @Override
    @Transactional
    public void deleteThesis(String id) {
        if (!thesisRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy đề tài mã: " + id);
        }
        thesisRepository.deleteById(id);
    }

    @Override
    public boolean checkAvailability(String id) {
        Thesis thesis = thesisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đề tài mã: " + id));
        return thesis.getCurrentStudents() < thesis.getMaxStudents();
    }

    @Override
    @Transactional
    public boolean registerStudent(String id) {
        if (!thesisRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy đề tài mã: " + id);
        }
        // Gọi hàm UPDATE nguyên tử dưới Repository để triệt tiêu Race Condition
        int updatedRows = thesisRepository.incrementStudentCountAtomic(id);
        return updatedRows > 0;
    }
}