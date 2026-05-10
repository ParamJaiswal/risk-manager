package com.ctm.controller;

import com.ctm.dto.*;
import com.ctm.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AI Controller - Proxies AI requests from the frontend to the Flask AI service.
 * 
 * Architecture flow:
 * React Frontend -> Spring Boot (this controller) -> Flask AI Service -> Groq API
 * 
 * The backend acts as a gateway/proxy to the AI service.
 * This keeps the AI service URL hidden from the frontend and allows
 * us to add authentication, rate limiting, logging, etc.
 */
@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    /**
     * POST /api/ai/describe
     * Generates an AI description for a compliance training.
     * Proxies to Flask AI service's /describe endpoint.
     */
    @PostMapping("/describe")
    public ResponseEntity<?> describe(@RequestBody DescribeRequest request) {
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Title is required");
        }
        try {
            DescribeResponse response = aiService.generateDescription(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(new DescribeResponse(
                "A comprehensive compliance training covering " + request.getTitle() + "."
            ));
        }
    }

    /**
     * POST /api/ai/recommend
     * Generates compliance recommendations for a training topic.
     * Proxies to Flask AI service's /recommend endpoint.
     */
    @PostMapping("/recommend")
    public ResponseEntity<?> recommend(@RequestBody RecommendRequest request) {
        if (request.getTraining() == null || request.getTraining().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Training topic is required");
        }
        try {
            RecommendResponse response = aiService.getRecommendations(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(new RecommendResponse(
                java.util.List.of("Conduct regular training sessions", "Implement monitoring", "Create documentation")
            ));
        }
    }

    /**
     * POST /api/ai/query
     * Answers questions using RAG (Retrieval-Augmented Generation).
     * Proxies to Flask AI service's /query endpoint.
     * 
     * RAG Flow:
     * 1. Question is sent to Flask AI service
     * 2. Flask searches ChromaDB for relevant document chunks
     * 3. Relevant chunks + question are sent to Groq LLM
     * 4. LLM generates an answer based on the retrieved context
     */
    @PostMapping("/query")
    public ResponseEntity<?> query(@RequestBody QueryRequest request) {
        if (request.getQuestion() == null || request.getQuestion().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Question is required");
        }
        try {
            QueryResponse response = aiService.queryDocuments(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(new QueryResponse(
                "I'm sorry, I couldn't process your question at this time.",
                java.util.List.of()
            ));
        }
    }
}
