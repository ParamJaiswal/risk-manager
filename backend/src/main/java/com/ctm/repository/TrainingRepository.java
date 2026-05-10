package com.ctm.repository;

import com.ctm.model.Training;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Training Repository - Spring Data JPA repository for Training entity.
 * 
 * By extending JpaRepository, we get all CRUD operations for free:
 * - findAll()  -> GET all trainings
 * - findById() -> GET training by ID
 * - save()     -> CREATE or UPDATE a training
 * - deleteById() -> DELETE a training
 * 
 * Spring Data JPA automatically implements these methods at runtime.
 */
@Repository
public interface TrainingRepository extends JpaRepository<Training, Long> {
    // No custom methods needed - JpaRepository provides all CRUD operations
}
