package com.soa.thesis_service.service.impl;

import com.soa.thesis_service.entity.Thesis;
import com.soa.thesis_service.repository.ThesisRepository;
import com.soa.thesis_service.service.ThesisService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ThesisServiceImpl implements ThesisService {

    private final ThesisRepository thesisRepository;

    @Override
    public List<Thesis> getAllTheses() {
        return thesisRepository.findAll();
    }

    @Override
    public Thesis getThesisById(String id) {
        return thesisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đề tài mã: " + id));
    }

    @Override
    @Transactional
    public Thesis createThesis(Thesis thesis) {
        if (thesisRepository.existsById(thesis.getId())) {
            throw new RuntimeException("Mã đề tài đã tồn tại: " + thesis.getId());
        }
        if (thesis.getCurrentStudents() == null) {
            thesis.setCurrentStudents(0);
        }
        return thesisRepository.save(thesis);
    }

    @Override
    @Transactional
    public Thesis updateThesis(String id, Thesis thesis) {
        Thesis existing = getThesisById(id);
        existing.setTitle(thesis.getTitle());
        existing.setInstructor(thesis.getInstructor());
        existing.setMaxStudents(thesis.getMaxStudents());
        if (thesis.getCurrentStudents() != null) {
            existing.setCurrentStudents(thesis.getCurrentStudents());
        }
        return thesisRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteThesis(String id) {
        if (!thesisRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy đề tài mã: " + id);
        }
        thesisRepository.deleteById(id);
    }

    @Override
    public boolean checkAvailability(String id) {
        Thesis thesis = getThesisById(id);
        return thesis.getCurrentStudents() < thesis.getMaxStudents();
    }

    @Override
    @Transactional
    public boolean registerStudent(String id) {
        Thesis thesis = getThesisById(id);
        if (thesis.getCurrentStudents() < thesis.getMaxStudents()) {
            thesis.setCurrentStudents(thesis.getCurrentStudents() + 1);
            thesisRepository.save(thesis);
            return true;
        }
        return false;
    }
}