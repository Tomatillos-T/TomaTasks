package com.springboot.TomaTask.dto;

import lombok.Data;
import java.util.List;

@Data
public class PaginationRequestDTO {
    private int page = 0;
    private int pageSize = 10;
    private String search;
    private List<ColumnFilterDTO> filters;
    private List<SortingDTO> sorting;
}
