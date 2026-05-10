package com.ctm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Request DTO for RAG query */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QueryRequest {
    private String question;
}
