package com.ctm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Training Entity - Represents a compliance training in the database.
 * 
 * Maps to the "trainings" table in PostgreSQL.
 * Uses JPA annotations for ORM (Object-Relational Mapping).
 * Lombok annotations (@Data, @NoArgsConstructor, @AllArgsConstructor) 
 * auto-generate getters, setters, constructors, toString, equals, and hashCode.
 */
@Entity
@Table(name = "trainings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Training {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, ACTIVE, COMPLETED
}
