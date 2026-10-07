package com.soa.thesis_service.repository;

import com.soa.thesis_service.entity.Thesis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ThesisRepository extends JpaRepository<Thesis, String> {

    // Câu lệnh UPDATE nguyên tử (Atomic Update) trực tiếp dưới CSDL
    @Modifying
    @Query("UPDATE Thesis t SET t.currentStudents = t.currentStudents + 1 " +
            "WHERE t.id = :id AND t.currentStudents < t.maxStudents")
    int incrementStudentCountAtomic(@Param("id") String id);
}