package com.ctm.controller;

import com.ctm.dto.AuthRequest;
import com.ctm.dto.AuthResponse;
import com.ctm.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller - Handles user login.
 * 
 * Uses a simple hardcoded admin user for demo purposes.
 * In production, you would use a database with hashed passwords.
 * 
 * Hardcoded credentials: admin / admin123
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // Hardcoded admin credentials for demo
    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin123";

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * POST /api/auth/login
     * Validates credentials and returns a JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        // Validate input
        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        // Check hardcoded credentials
        if (ADMIN_USERNAME.equals(request.getUsername()) 
                && ADMIN_PASSWORD.equals(request.getPassword())) {
            
            // Generate JWT token for the authenticated user
            String token = jwtUtil.generateToken(request.getUsername());
            
            return ResponseEntity.ok(new AuthResponse(token, ADMIN_USERNAME, "ADMIN"));
        }

        return ResponseEntity.status(401).body("Invalid username or password");
    }
}
