package com.ctm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Request DTO for AI description generation */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DescribeRequest {
    private String title;
}
