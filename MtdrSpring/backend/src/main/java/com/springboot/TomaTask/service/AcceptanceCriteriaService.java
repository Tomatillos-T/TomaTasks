package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.AcceptanceCriteriaDTO;
import com.springboot.TomaTask.mapper.AcceptanceCriteriaMapper;
import com.springboot.TomaTask.model.AcceptanceCriteria;
import com.springboot.TomaTask.model.UserStory;
import com.springboot.TomaTask.repository.AcceptanceCriteriaRepository;
import com.springboot.TomaTask.repository.UserStoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AcceptanceCriteriaService {

    private final AcceptanceCriteriaRepository acceptanceCriteriaRepository;
    private final UserStoryRepository userStoryRepository;

    public AcceptanceCriteriaService(AcceptanceCriteriaRepository acceptanceCriteriaRepository,
                                     UserStoryRepository userStoryRepository) {
        this.acceptanceCriteriaRepository = acceptanceCriteriaRepository;
        this.userStoryRepository = userStoryRepository;
    }

    public List<AcceptanceCriteriaDTO> getAllAcceptanceCriteria() {
        return AcceptanceCriteriaMapper.toDTOSet(
                acceptanceCriteriaRepository.findAll().stream().collect(java.util.stream.Collectors.toSet())
        ).stream().collect(java.util.stream.Collectors.toList());
    }

    public AcceptanceCriteriaDTO getAcceptanceCriteriaById(String id) {
        AcceptanceCriteria criteria = acceptanceCriteriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Acceptance Criteria not found with ID: " + id));
        return AcceptanceCriteriaMapper.toDTO(criteria);
    }

    public AcceptanceCriteriaDTO createAcceptanceCriteria(AcceptanceCriteriaDTO criteriaDTO) {
        AcceptanceCriteria criteria = AcceptanceCriteriaMapper.toEntity(criteriaDTO);

        if (criteriaDTO.getUserStoryId() != null) {
            UserStory userStory = userStoryRepository.findById(criteriaDTO.getUserStoryId())
                    .orElseThrow(() -> new RuntimeException("UserStory not found with ID: " + criteriaDTO.getUserStoryId()));
            criteria.setUserStory(userStory);
        } else {
            throw new RuntimeException("UserStory ID is required");
        }

        AcceptanceCriteria savedCriteria = acceptanceCriteriaRepository.save(criteria);
        return AcceptanceCriteriaMapper.toDTO(savedCriteria);
    }

    public AcceptanceCriteriaDTO updateAcceptanceCriteria(String id, AcceptanceCriteriaDTO criteriaDTO) {
        AcceptanceCriteria criteria = acceptanceCriteriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Acceptance Criteria not found with ID: " + id));

        criteria.setDescription(criteriaDTO.getDescription());
        criteria.setStatus(criteriaDTO.getStatus());

        if (criteriaDTO.getUserStoryId() != null) {
            UserStory userStory = userStoryRepository.findById(criteriaDTO.getUserStoryId())
                    .orElseThrow(() -> new RuntimeException("UserStory not found with ID: " + criteriaDTO.getUserStoryId()));
            criteria.setUserStory(userStory);
        }

        AcceptanceCriteria updatedCriteria = acceptanceCriteriaRepository.save(criteria);
        return AcceptanceCriteriaMapper.toDTO(updatedCriteria);
    }

    public void deleteAcceptanceCriteria(String id) {
        acceptanceCriteriaRepository.deleteById(id);
    }

    public List<AcceptanceCriteriaDTO> getAcceptanceCriteriaByUserStoryId(String userStoryId) {
        UserStory userStory = userStoryRepository.findById(userStoryId)
                .orElseThrow(() -> new RuntimeException("UserStory not found with ID: " + userStoryId));
        return AcceptanceCriteriaMapper.toDTOSet(userStory.getAcceptanceCriteria()).stream()
                .collect(java.util.stream.Collectors.toList());
    }
}
