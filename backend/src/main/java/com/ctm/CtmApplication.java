package com.ctm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Compliance Training Manager - Spring Boot Application
 * 
 * This is the main entry point for the backend service.
 * It provides REST APIs for:
 * - Authentication (JWT-based)
 * - Training CRUD operations
 * - AI features (proxied to Flask AI service)
 */
@SpringBootApplication
public class CtmApplication {
    public static void main(String[] args) {
        SpringApplication.run(CtmApplication.class, args);
    }
}
