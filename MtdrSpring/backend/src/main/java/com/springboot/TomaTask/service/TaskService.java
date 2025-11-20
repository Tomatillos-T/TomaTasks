package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.TaskDTO;
import com.springboot.TomaTask.mapper.TaskMapper;
import com.springboot.TomaTask.model.Sprint;
import com.springboot.TomaTask.model.Task;
import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.repository.SprintRepository;
import com.springboot.TomaTask.repository.TaskRepository;
import com.springboot.TomaTask.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.springboot.TomaTask.dto.PaginationRequestDTO;
import com.springboot.TomaTask.dto.SortingDTO;
import com.springboot.TomaTask.dto.ColumnFilterDTO;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final SprintRepository sprintRepository;

    public TaskService(TaskRepository taskRepository,
            SprintRepository sprintRepository,
            UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.sprintRepository = sprintRepository;
    }

    public List<TaskDTO> getAllTasks() {
        return TaskMapper.toDTOList(taskRepository.findAll());
    }

    public Page<TaskDTO> searchTasks(PaginationRequestDTO request) {
        Specification<Task> spec = buildSpecification(request);
        Pageable pageable = PageRequest.of(
                request.getPage(),
                request.getPageSize(),
                getSort(request.getSorting()));
        return taskRepository.findAll(spec, pageable).map(TaskMapper::toDTO);
    }

    // Build Specification dynamically
    private Specification<Task> buildSpecification(PaginationRequestDTO request) {
        Specification<Task> spec = Specification.unrestricted();

        // Search keyword
        if (request.getSearch() != null && !request.getSearch().isEmpty()) {
            String keyword = request.getSearch().toLowerCase();
            spec = spec.and((root, query, cb) -> {
                Join<Task, Sprint> sprintJoin = root.join("sprint", JoinType.LEFT);
                Join<Task, User> userJoin = root.join("user", JoinType.LEFT);

                return cb.or(
                        cb.like(cb.lower(root.get("name")), "%" + keyword + "%"),
                        cb.like(cb.lower(root.get("description")), "%" + keyword + "%"),
                        cb.equal(cb.lower(root.get("status")), keyword),
                        cb.equal(cb.lower(root.get("priority")), keyword),
                        cb.equal(cb.lower(root.get("estimation")), keyword),
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
                // Skip empty filters
                if (filter.getValue() == null || filter.getValue().isEmpty()) {
                    continue;
                }

                spec = spec.and((root, query, cb) -> {
                    String[] value = filter.getId().split("\\.");
                    List<String> filterValues = filter.getValue();

                    switch (value[0]) {
                        case "sprint":
                            Join<Task, Sprint> sprintJoin = root.join("sprint", JoinType.LEFT);
                            return sprintJoin.get(value[1]).in(filterValues);
                        case "user":
                            Join<Task, User> userJoin = root.join("user", JoinType.LEFT);
                            return userJoin.get(value[1]).in(filterValues);
                        default:
                            return root.get(value[0]).in(filterValues);
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

    public TaskDTO getTaskById(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));
        return TaskMapper.toDTOWithNested(task, true);
    }

    public TaskDTO createTask(TaskDTO taskDTO) {
        Task task = TaskMapper.toEntity(taskDTO);

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
        task.setTimeTaken(taskDTO.getTimeTaken());
        task.setPriority(taskDTO.getPriority());
        task.setEstimation(taskDTO.getEstimation());
        task.setStartDate(taskDTO.getStartDate());
        task.setEndDate(taskDTO.getEndDate());
        task.setDeliveryDate(taskDTO.getDeliveryDate());

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

    public List<TaskDTO> getTasksByAssigneeId(String assigneeId) {
        return TaskMapper.toDTOList(taskRepository.findByUserId(assigneeId));
    }

    /**
     * Get all completed tasks for a specific sprint
     * @param sprintId the ID of the sprint
     * @return list of TaskDTOs with status DONE for the given sprint
     */
    public List<TaskDTO> getCompletedTasksBySprintId(String sprintId) {
        List<Task> completedTasks = taskRepository.findBySprintIdAndStatus(sprintId, Task.Status.DONE);
        return TaskMapper.toDTOList(completedTasks);
    }

    /**
     * Get all completed tasks for a specific user in a specific sprint
     * @param sprintId the ID of the sprint
     * @param userId the ID of the user (assignee)
     * @return list of TaskDTOs with status DONE for the given user in the given sprint
     */
    public List<TaskDTO> getCompletedTasksBySprintIdAndUserId(String sprintId, String userId) {
        List<Task> completedTasks = taskRepository.findBySprintIdAndUserIdAndStatus(
            sprintId, userId, Task.Status.DONE);
        return TaskMapper.toDTOList(completedTasks);
    }
}
