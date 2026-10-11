
package com.soa.registration_service.repository;

import com.soa.registration_service.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRepository
        extends JpaRepository<Registration, Long> {
}
