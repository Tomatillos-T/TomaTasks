package com.springboot.TomaTask.service;

import com.springboot.TomaTask.model.Sprint;
import com.springboot.TomaTask.model.Task;
import com.springboot.TomaTask.model.UserStory;
import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.repository.SprintRepository;
import com.springboot.TomaTask.repository.TaskRepository;
import com.springboot.TomaTask.repository.UserStoryRepository;

import jakarta.persistence.criteria.JoinType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.springboot.TomaTask.dto.PaginationRequestDTO;
import com.springboot.TomaTask.dto.SortingDTO;
import com.springboot.TomaTask.dto.ColumnFilterDTO;
import com.springboot.TomaTask.dto.TaskDTO;
import com.springboot.TomaTask.mapper.TaskMapper;
import java.util.stream.Collectors;

import jakarta.persistence.criteria.Join;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserStoryRepository userStoryRepository;
    private final SprintRepository sprintRepository;
    private final TaskMapper taskMapper;

    public TaskService(TaskRepository taskRepository,
            UserStoryRepository userStoryRepository,
            SprintRepository sprintRepository,
            TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.userStoryRepository = userStoryRepository;
        this.sprintRepository = sprintRepository;
        this.taskMapper = taskMapper;
    }

    public List<TaskDTO> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        List<TaskDTO> taskDTOs = tasks.stream()
                .map(taskMapper::toDTO)
                .collect(Collectors.toList());
        return taskDTOs;
    }

    public Page<Task> searchTasks(PaginationRequestDTO request) {
        Specification<Task> spec = buildSpecification(request);
        Pageable pageable = PageRequest.of(
                request.getPage(),
                request.getPageSize(),
                getSort(request.getSorting()));
        return taskRepository.findAll(spec, pageable);
    }

    // Build Specification dynamically
    private Specification<Task> buildSpecification(PaginationRequestDTO request) {
        Specification<Task> spec = Specification.unrestricted();

        // Search keyword
        if (request.getSearch() != null && !request.getSearch().isEmpty()) {
            String keyword = request.getSearch().toLowerCase();
            spec = spec.and((root, query, cb) -> {
                Join<Task, UserStory> userStoryJoin = root.join("userStory", JoinType.LEFT);
                Join<Task, Sprint> sprintJoin = root.join("sprint", JoinType.LEFT);
                Join<Task, User> userJoin = root.join("user", JoinType.LEFT);

                return cb.or(
                        cb.like(cb.lower(root.get("name")), "%" + keyword + "%"),
                        cb.like(cb.lower(root.get("description")), "%" + keyword + "%"),
                        cb.equal(cb.lower(root.get("status")), keyword),
                        cb.like(cb.lower(userStoryJoin.get("name")), "%" + keyword + "%"),
                        cb.like(cb.lower(userStoryJoin.get("description")), "%" + keyword + "%"),
                        cb.like(cb.lower(userJoin.get("email")), "%" + keyword + "%"),
                        cb.like(cb
                                .lower(cb.concat(cb.concat(userJoin.get("firstName"), " "), userJoin.get("lastName"))),
                                "%" + keyword + "%"),
                        cb.like(cb.lower(sprintJoin.get("description")), "%" + keyword + "%"));
            });
        }

        // Dynamic filters
        if (request.getFilters() != null) {
            for (ColumnFilterDTO filter : request.getFilters()) {
                spec = spec.and((root, query, cb) -> {
                    String[] value = filter.getId().split("\\.");
                    switch (value[0]) {
                        case "userStory":
                            Join<Task, UserStory> userStoryJoin = root.join("userStory", JoinType.LEFT);
                            return cb.equal(userStoryJoin.get(value[1]), filter.getValue());
                        case "sprint":
                            Join<Task, Sprint> sprintJoin = root.join("sprint", JoinType.LEFT);
                            return cb.equal(sprintJoin.get(value[1]), filter.getValue());
                        case "user":
                            Join<Task, User> userJoin = root.join("user", JoinType.LEFT);
                            return cb.equal(userJoin.get(value[1]), filter.getValue());
                        default:
                            return cb.equal(root.get(value[0]), filter.getValue());
                    }
                });
            }
        }

        return spec;
    }

    // Convert frontend sorting into Spring Sort
    private Sort getSort(List<SortingDTO> sorting) {
        if (sorting == null || sorting.isEmpty())
            return Sort.unsorted();
        Sort sort = Sort.by(sorting.get(0).isDesc() ? Sort.Direction.DESC : Sort.Direction.ASC, sorting.get(0).getId());
        for (int i = 1; i < sorting.size(); i++) {
            SortingDTO s = sorting.get(i);
            sort = sort.and(Sort.by(s.isDesc() ? Sort.Direction.DESC : Sort.Direction.ASC, s.getId()));
        }
        return sort;
    }

    public List<Task> findByUserStoryId(String userStoryId) {
        return taskRepository.findByUserStoryId(userStoryId);
    }

    public List<Task> findBySprintId(String sprintId) {
        return taskRepository.findBySprintId(sprintId);
    }

    public List<Task> findByUserId(String userId) {
        return taskRepository.findByUserId(userId);
    }

    public Task getTaskById(String id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task no encontrada"));
    }

    // Crear task
    public Task createTask(Task task) {
        // Buscar las entidades relacionadas
        if (task.getUserStory() != null && task.getUserStory().getId() != null) {
            UserStory userStory = userStoryRepository.findById(task.getUserStory().getId())
                    .orElseThrow(() -> new RuntimeException("UserStory no encontrada"));
            task.setUserStory(userStory);
        }

        if (task.getSprint() != null && task.getSprint().getId() != null) {
            Sprint sprint = sprintRepository.findById(task.getSprint().getId())
                    .orElseThrow(() -> new RuntimeException("Sprint no encontrado"));
            task.setSprint(sprint);
        }

        return taskRepository.save(task);
    }

    // Actualizar task
    public Task updateTask(String id, Task taskDetails) {
        Task task = getTaskById(id);

        task.setName(taskDetails.getName());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setStartDate(taskDetails.getStartDate());
        task.setEndDate(taskDetails.getEndDate());
        task.setDeliveryDate(taskDetails.getDeliveryDate());

        if (taskDetails.getUserStory() != null && taskDetails.getUserStory().getId() != null) {
            UserStory userStory = userStoryRepository.findById(taskDetails.getUserStory().getId())
                    .orElseThrow(() -> new RuntimeException("UserStory no encontrada"));
            task.setUserStory(userStory);
        }

        if (taskDetails.getSprint() != null && taskDetails.getSprint().getId() != null) {
            Sprint sprint = sprintRepository.findById(taskDetails.getSprint().getId())
                    .orElseThrow(() -> new RuntimeException("Sprint no encontrado"));
            task.setSprint(sprint);
        }

        return taskRepository.save(task);
    }

    public void deleteTask(String id) {
        taskRepository.deleteById(id);
    }
}
