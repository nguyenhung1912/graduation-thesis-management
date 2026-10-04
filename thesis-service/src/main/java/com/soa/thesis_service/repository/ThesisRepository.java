package com.soa.thesis_service.repository;

import com.soa.thesis_service.entity.Thesis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ThesisRepository extends JpaRepository<Thesis, String> {
}