package com.ctm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/** Response DTO for AI recommendations */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendResponse {
    private List<String> recommendations;
}
