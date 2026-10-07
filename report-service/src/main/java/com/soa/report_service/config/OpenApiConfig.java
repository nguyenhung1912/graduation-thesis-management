package com.soa.report_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Cấu hình OpenAPI 3.0 / Swagger UI cho report-service.
 * Chuẩn hóa tài liệu giao tiếp dịch vụ (Standardized Service Contract) theo chuẩn SOA.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Report Service API")
                        .version("1.0.0")
                        .description("API xuất báo cáo và tài liệu PDF cho hệ thống quản lý đồ án tốt nghiệp"))
                .servers(List.of(
                        new Server().url("http://localhost:8084").description("Local")
                ));
    }
}
