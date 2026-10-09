
package com.soa.registration_service.controller;

import com.soa.registration_service.dto.RegistrationRequest;
import com.soa.registration_service.dto.RegistrationResponse;
import com.soa.registration_service.entity.Registration;
import com.soa.registration_service.service.RegistrationService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "*")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(
            RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @GetMapping
    public List<RegistrationResponse> getAllRegistrations() {
        return registrationService.getAllRegistrations()
                .stream()
                .map(registration -> new RegistrationResponse(
                        registration.getId(),
                        registration.getStudentId(),
                        registration.getThesisId(),
                        registration.getStatus()))
                .toList();
    }

    @PostMapping
    public ResponseEntity<RegistrationResponse> createRegistration(
            @Valid @RequestBody RegistrationRequest request) {

        Registration registration = new Registration();
        registration.setStudentId(request.getStudentId());
        registration.setThesisId(request.getThesisId());
        registration.setStatus(request.getStatus());

        Registration saved =
                registrationService.createRegistration(registration);

        RegistrationResponse response = new RegistrationResponse(
                saved.getId(),
                saved.getStudentId(),
                saved.getThesisId(),
                saved.getStatus());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public RegistrationResponse getRegistrationById(
            @PathVariable Long id) {

        Registration registration =
                registrationService.getRegistrationById(id);

        return new RegistrationResponse(
                registration.getId(),
                registration.getStudentId(),
                registration.getThesisId(),
                registration.getStatus());
    }
}
