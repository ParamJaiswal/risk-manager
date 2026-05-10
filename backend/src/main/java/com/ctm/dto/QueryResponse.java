package com.ctm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/** Response DTO for RAG query */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QueryResponse {
    private String answer;
    private List<String> sources;
}
