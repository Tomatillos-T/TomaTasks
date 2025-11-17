
package com.springboot.TomaTask.mapper;

import com.springboot.TomaTask.dto.AcceptanceCriteriaDTO;
import com.springboot.TomaTask.model.AcceptanceCriteria;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class AcceptanceCriteriaMapper {

    public static AcceptanceCriteriaDTO toDTO(AcceptanceCriteria criteria) {
        if (criteria == null) {
            return null;
        }

        AcceptanceCriteriaDTO dto = new AcceptanceCriteriaDTO();
        dto.setId(criteria.getId());
        dto.setDescription(criteria.getDescription());
        dto.setStatus(criteria.getStatus());
        dto.setCreatedAt(criteria.getCreatedAt());
        dto.setUpdatedAt(criteria.getUpdatedAt());

        if (criteria.getUserStory() != null) {
            dto.setUserStoryId(criteria.getUserStory().getId());
        }

        return dto;
    }

    public static AcceptanceCriteria toEntity(AcceptanceCriteriaDTO dto) {
        if (dto == null) {
            return null;
        }

        AcceptanceCriteria criteria = new AcceptanceCriteria();
        criteria.setDescription(dto.getDescription());
        criteria.setStatus(dto.getStatus());

        return criteria;
    }

    public static AcceptanceCriteria toEntityWithId(AcceptanceCriteriaDTO dto) {
        AcceptanceCriteria criteria = toEntity(dto);
        if (dto != null && dto.getId() != null) {
            criteria.setId(dto.getId());
        }
        return criteria;
    }

    public static Set<AcceptanceCriteriaDTO> toDTOSet(Set<AcceptanceCriteria> criterias) {
        if (criterias == null) {
            return new HashSet<>();
        }
        return criterias.stream()
                .map(AcceptanceCriteriaMapper::toDTO)
                .collect(Collectors.toSet());
    }

    public static Set<AcceptanceCriteria> toEntitySet(Set<AcceptanceCriteriaDTO> dtos) {
        if (dtos == null) {
            return new HashSet<>();
        }
        return dtos.stream()
                .map(AcceptanceCriteriaMapper::toEntity)
                .collect(Collectors.toSet());
    }
}
