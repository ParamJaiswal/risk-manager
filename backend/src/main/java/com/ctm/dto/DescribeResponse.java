package com.ctm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Response DTO for AI description generation */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DescribeResponse {
    private String description;
}
