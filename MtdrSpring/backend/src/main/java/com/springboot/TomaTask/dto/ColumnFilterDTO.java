package com.springboot.TomaTask.dto;

import lombok.Data;
import java.util.List;

@Data
public class ColumnFilterDTO {
    private String id;
    private List<String> value;
}
