package com.ctm.controller;

import com.ctm.model.Training;
import com.ctm.service.TrainingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Training Controller - REST API for CRUD operations on compliance trainings.
 * 
 * All endpoints require JWT authentication (configured in SecurityConfig).
 * 
 * Endpoints:
 * - GET    /api/trainings      -> List all trainings
 * - POST   /api/trainings      -> Create a new training
 * - PUT    /api/trainings/{id} -> Update an existing training
 * - DELETE /api/trainings/{id} -> Delete a training
 */
@RestController
@RequestMapping("/api/trainings")
public class TrainingController {

    @Autowired
    private TrainingService trainingService;

    /** GET /api/trainings - Returns all trainings */
    @GetMapping
    public ResponseEntity<List<Training>> getAllTrainings() {
        return ResponseEntity.ok(trainingService.getAllTrainings());
    }

    /** GET /api/trainings/{id} - Returns a single training by ID */
    @GetMapping("/{id}")
    public ResponseEntity<?> getTrainingById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(trainingService.getTrainingById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /** POST /api/trainings - Creates a new training */
    @PostMapping
    public ResponseEntity<?> createTraining(@RequestBody Training training) {
        if (training.getTitle() == null || training.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Training title is required");
        }
        return ResponseEntity.ok(trainingService.createTraining(training));
    }

    /** PUT /api/trainings/{id} - Updates an existing training */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTraining(@PathVariable Long id, @RequestBody Training training) {
        try {
            return ResponseEntity.ok(trainingService.updateTraining(id, training));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /** DELETE /api/trainings/{id} - Deletes a training */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTraining(@PathVariable Long id) {
        try {
            trainingService.deleteTraining(id);
            return ResponseEntity.ok().body("Training deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
