
package com.soa.registration_service.service;

import com.soa.registration_service.entity.Registration;
import com.soa.registration_service.exception.RegistrationNotFoundException;
import com.soa.registration_service.repository.RegistrationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;

    public RegistrationService(RegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
    }

    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    public Registration createRegistration(Registration registration) {
        return registrationRepository.save(registration);
    }

    public Registration getRegistrationById(Long id) {
        return registrationRepository.findById(id)
                .orElseThrow(() -> new RegistrationNotFoundException(id));
    }

    @Transactional
    public Registration updateStatus(Long id, String status) {
        Registration registration = getRegistrationById(id);
        registration.setStatus(status);
        return registrationRepository.save(registration);
    }

    @Transactional
    public void deleteRegistration(Long id) {
        Registration registration = getRegistrationById(id);
        registrationRepository.delete(registration);
    }
}
