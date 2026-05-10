package com.ctm.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

/**
 * JWT Authentication Filter - Intercepts every HTTP request to validate JWT tokens.
 * 
 * How it works:
 * 1. Extract the "Authorization" header from the request
 * 2. Check if it starts with "Bearer " (JWT token format)
 * 3. Extract the token and validate it using JwtUtil
 * 4. If valid, set the authentication in Spring Security context
 * 5. If invalid or missing, the request continues without authentication
 *    (Spring Security will deny access to protected endpoints)
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // Step 1: Get the Authorization header
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        // Step 2: Check if the header contains a Bearer token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // Remove "Bearer " prefix
            try {
                username = jwtUtil.extractUsername(token);
            } catch (Exception e) {
                // Invalid token - continue without authentication
                System.out.println("Invalid JWT token: " + e.getMessage());
            }
        }

        // Step 3: If we have a valid username and no existing authentication
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Step 4: Validate the token
            if (jwtUtil.validateToken(token, username)) {
                // Create authentication object and set it in the security context
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Step 5: Continue the filter chain
        filterChain.doFilter(request, response);
    }
}
