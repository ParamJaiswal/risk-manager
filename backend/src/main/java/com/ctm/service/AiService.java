package com.ctm.service;

import com.ctm.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * AI Service - Communicates with the Flask AI microservice using RestTemplate.
 * 
 * This service acts as a bridge between the Spring Boot backend and the Flask AI service.
 * 
 * Communication flow:
 * Frontend (React) -> Backend (Spring Boot/this service) -> AI Service (Flask) -> Groq API
 * 
 * Why proxy through Spring Boot?
 * 1. Authentication - Frontend requests are JWT-authenticated at the backend
 * 2. Security - AI service URL and API keys stay hidden from the client
 * 3. Logging - Backend can log and monitor AI requests
 * 4. Fallbacks - Backend can provide fallback responses if AI service is down
 */
@Service
public class AiService {

    @Autowired
    private RestTemplate restTemplate;

    // Flask AI service URL - configured in application.properties
    @Value("${ai.service.url}")
    private String aiServiceUrl;

    /**
     * Generate a compliance training description using AI.
     * Calls Flask AI service's POST /describe endpoint.
     */
    public DescribeResponse generateDescription(DescribeRequest request) {
        try {
            String url = aiServiceUrl + "/describe";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // Send the request to Flask AI service
            HttpEntity<DescribeRequest> entity = new HttpEntity<>(request, headers);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);
            
            String description = (String) response.get("description");
            return new DescribeResponse(description);
        } catch (Exception e) {
            System.err.println("Error calling AI describe service: " + e.getMessage());
            throw new RuntimeException("AI service unavailable", e);
        }
    }

    /**
     * Get compliance recommendations using AI.
     * Calls Flask AI service's POST /recommend endpoint.
     */
    public RecommendResponse getRecommendations(RecommendRequest request) {
        try {
            String url = aiServiceUrl + "/recommend";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<RecommendRequest> entity = new HttpEntity<>(request, headers);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);
            
            @SuppressWarnings("unchecked")
            List<String> recommendations = (List<String>) response.get("recommendations");
            return new RecommendResponse(recommendations);
        } catch (Exception e) {
            System.err.println("Error calling AI recommend service: " + e.getMessage());
            throw new RuntimeException("AI service unavailable", e);
        }
    }

    /**
     * Query compliance documents using RAG (Retrieval-Augmented Generation).
     * Calls Flask AI service's POST /query endpoint.
     * 
     * This is the most important AI feature:
     * 1. The question is sent to the Flask AI service
     * 2. Flask retrieves relevant document chunks from ChromaDB
     * 3. The retrieved context + question is sent to Groq LLM
     * 4. Groq generates an answer grounded in the actual compliance documents
     */
    public QueryResponse queryDocuments(QueryRequest request) {
        try {
            String url = aiServiceUrl + "/query";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<QueryRequest> entity = new HttpEntity<>(request, headers);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);
            
            String answer = (String) response.get("answer");
            
            @SuppressWarnings("unchecked")
            List<String> sources = (List<String>) response.get("sources");
            
            return new QueryResponse(answer, sources != null ? sources : List.of());
        } catch (Exception e) {
            System.err.println("Error calling AI query service: " + e.getMessage());
            throw new RuntimeException("AI service unavailable", e);
        }
    }
}
