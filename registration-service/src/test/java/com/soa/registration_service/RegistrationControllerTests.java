package com.soa.registration_service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class RegistrationControllerTests {

    @Autowired
    private MockMvc mockMvc;

    private long createRegistration() throws Exception {
        String body = mockMvc.perform(post("/api/registrations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"studentId\":\"SV099\",\"thesisId\":\"DT01\",\"status\":\"PENDING\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return Long.parseLong(body.replaceAll(".*\"id\":(\\d+).*", "$1"));
    }

    @Test
    void updateStatus_success() throws Exception {
        long id = createRegistration();
        mockMvc.perform(patch("/api/registrations/" + id + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"APPROVED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("APPROVED")));
    }

    @Test
    void updateStatus_invalidValue_returns400() throws Exception {
        long id = createRegistration();
        mockMvc.perform(patch("/api/registrations/" + id + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"ABC\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateStatus_notFound_returns404() throws Exception {
        mockMvc.perform(patch("/api/registrations/99999/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"APPROVED\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_success_then_notFound() throws Exception {
        long id = createRegistration();
        mockMvc.perform(delete("/api/registrations/" + id))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/api/registrations/" + id))
                .andExpect(status().isNotFound());
        mockMvc.perform(delete("/api/registrations/" + id))
                .andExpect(status().isNotFound());
    }
}
