package com.ctm.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Application Configuration - Beans used across the application.
 * 
 * RestTemplate is used by the backend to make HTTP calls to the Flask AI service.
 * Flow: React Frontend -> Spring Boot (RestTemplate) -> Flask AI Service
 */
@Configuration
public class AppConfig {

    /**
     * RestTemplate bean for making HTTP calls to the Flask AI service.
     * Used in AiService to proxy AI requests from the frontend.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
