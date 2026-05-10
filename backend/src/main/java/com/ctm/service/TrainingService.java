package com.ctm.service;

import com.ctm.model.Training;
import com.ctm.repository.TrainingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Training Service - Business logic for compliance training CRUD operations.
 * 
 * Sits between the Controller and Repository layers.
 * Handles validation and business rules.
 */
@Service
public class TrainingService {

    @Autowired
    private TrainingRepository trainingRepository;

    /** Get all trainings from the database */
    public List<Training> getAllTrainings() {
        return trainingRepository.findAll();
    }

    /** Get a single training by ID */
    public Training getTrainingById(Long id) {
        return trainingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training not found with id: " + id));
    }

    /** Create a new training */
    public Training createTraining(Training training) {
        // Set default status if not provided
        if (training.getStatus() == null || training.getStatus().trim().isEmpty()) {
            training.setStatus("PENDING");
        }
        training.setId(null); // Ensure new record
        return trainingRepository.save(training);
    }

    /** Update an existing training */
    public Training updateTraining(Long id, Training updatedTraining) {
        Training existing = getTrainingById(id);
        
        if (updatedTraining.getTitle() != null) {
            existing.setTitle(updatedTraining.getTitle());
        }
        if (updatedTraining.getDescription() != null) {
            existing.setDescription(updatedTraining.getDescription());
        }
        if (updatedTraining.getStatus() != null) {
            existing.setStatus(updatedTraining.getStatus());
        }
        
        return trainingRepository.save(existing);
    }

    /** Delete a training by ID */
    public void deleteTraining(Long id) {
        if (!trainingRepository.existsById(id)) {
            throw new RuntimeException("Training not found with id: " + id);
        }
        trainingRepository.deleteById(id);
    }
}
