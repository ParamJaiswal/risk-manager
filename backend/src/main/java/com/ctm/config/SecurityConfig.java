package com.ctm.config;

import com.ctm.security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Security Configuration - Configures Spring Security for JWT authentication.
 * 
 * Key decisions:
 * - /api/auth/** endpoints are PUBLIC (no authentication needed for login)
 * - All other /api/** endpoints require a valid JWT token
 * - CSRF is disabled because we use stateless JWT (not cookies)
 * - CORS is enabled for the React frontend running on port 5173
 * - Sessions are STATELESS (JWT handles authentication state)
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Enable CORS with our configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Disable CSRF - not needed for stateless JWT authentication
            .csrf(csrf -> csrf.disable())
            // Configure endpoint authorization
            .authorizeHttpRequests(auth -> auth
                // Allow login endpoint without authentication
                .requestMatchers("/api/auth/**").permitAll()
                // All other API endpoints require authentication
                .requestMatchers("/api/**").authenticated()
                // Allow everything else (health checks, etc.)
                .anyRequest().permitAll()
            )
            // Use stateless sessions (JWT handles auth state)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            // Add our JWT filter before Spring's default auth filter
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * CORS Configuration - Allows the React frontend to make API calls.
     * Uses allowedOriginPatterns to support both localhost and deployed URLs.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow localhost for dev and any Vercel/Netlify/Render URL for production
        configuration.setAllowedOriginPatterns(List.of(
            "http://localhost:*",
            "https://*.vercel.app",
            "https://*.netlify.app",
            "https://*.onrender.com"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
