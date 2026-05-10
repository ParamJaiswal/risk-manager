package com.ctm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Request DTO for AI recommendations */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendRequest {
    private String training;
}
