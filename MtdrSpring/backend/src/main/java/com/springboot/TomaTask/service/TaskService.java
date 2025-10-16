package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.TaskDTO;
import com.springboot.TomaTask.mapper.TaskMapper;
import com.springboot.TomaTask.model.Sprint;
import com.springboot.TomaTask.model.Task;
import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.model.UserStory;
import com.springboot.TomaTask.repository.SprintRepository;
import com.springboot.TomaTask.repository.TaskRepository;
import com.springboot.TomaTask.repository.UserRepository;
import com.springboot.TomaTask.repository.UserStoryRepository;

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
import jakarta.persistence.criteria.JoinType;
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
        return TaskMapper.toDTOList(taskRepository.findAll());
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
    private final UserRepository userRepository;

    public TaskDTO getTaskById(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));
        return TaskMapper.toDTOWithNested(task, true);
    }

    public TaskDTO createTask(TaskDTO taskDTO) {
        Task task = TaskMapper.toEntity(taskDTO);

        // Set UserStory
        if (taskDTO.getUserStoryId() != null) {
            UserStory userStory = userStoryRepository.findById(taskDTO.getUserStoryId())
                    .orElseThrow(() -> new RuntimeException("UserStory not found with ID: " + taskDTO.getUserStoryId()));
            task.setUserStory(userStory);
        }

        // Set Sprint
        if (taskDTO.getSprintId() != null) {
            Sprint sprint = sprintRepository.findById(taskDTO.getSprintId())
                    .orElseThrow(() -> new RuntimeException("Sprint not found with ID: " + taskDTO.getSprintId()));
            task.setSprint(sprint);
        }

        // Set Assignee
        if (taskDTO.getAssigneeId() != null) {
            User user = userRepository.findById(taskDTO.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + taskDTO.getAssigneeId()));
            task.setUser(user);
        }

        Task savedTask = taskRepository.save(task);
        return TaskMapper.toDTOWithNested(savedTask, true);
    }

    public TaskDTO updateTask(String id, TaskDTO taskDTO) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));

        task.setName(taskDTO.getName());
        task.setDescription(taskDTO.getDescription());
        task.setTimeEstimate(taskDTO.getTimeEstimate());
        task.setStatus(taskDTO.getStatus());
        task.setStartDate(taskDTO.getStartDate());
        task.setEndDate(taskDTO.getEndDate());
        task.setDeliveryDate(taskDTO.getDeliveryDate());

        // Update UserStory
        if (taskDTO.getUserStoryId() != null) {
            UserStory userStory = userStoryRepository.findById(taskDTO.getUserStoryId())
                    .orElseThrow(() -> new RuntimeException("UserStory not found with ID: " + taskDTO.getUserStoryId()));
            task.setUserStory(userStory);
        }

        // Update Sprint
        if (taskDTO.getSprintId() != null) {
            Sprint sprint = sprintRepository.findById(taskDTO.getSprintId())
                    .orElseThrow(() -> new RuntimeException("Sprint not found with ID: " + taskDTO.getSprintId()));
            task.setSprint(sprint);
        }

        // Update Assignee
        if (taskDTO.getAssigneeId() != null) {
            User user = userRepository.findById(taskDTO.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + taskDTO.getAssigneeId()));
            task.setUser(user);
        } else {
            task.setUser(null);
        }

        Task updatedTask = taskRepository.save(task);
        return TaskMapper.toDTOWithNested(updatedTask, true);
    }

    public void deleteTask(String id) {
        taskRepository.deleteById(id);
    }

    public List<TaskDTO> getTasksBySprintId(String sprintId) {
        return TaskMapper.toDTOList(taskRepository.findBySprintId(sprintId));
    }

    public List<TaskDTO> getTasksByUserStoryId(String userStoryId) {
        return TaskMapper.toDTOList(taskRepository.findByUserStoryId(userStoryId));
    }

    public List<TaskDTO> getTasksByAssigneeId(String assigneeId) {
        return TaskMapper.toDTOList(taskRepository.findByUserId(assigneeId));
    }
}
