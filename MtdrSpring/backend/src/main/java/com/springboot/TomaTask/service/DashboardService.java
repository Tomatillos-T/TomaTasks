package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.DashboardResponseDTO;
import com.springboot.TomaTask.dto.DeveloperMetricDTO;
import com.springboot.TomaTask.dto.KpiDTO;
import com.springboot.TomaTask.dto.SprintHoursDTO;
import com.springboot.TomaTask.dto.TaskReportDTO;
import com.springboot.TomaTask.model.Sprint;
import com.springboot.TomaTask.model.Task;
import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.repository.SprintRepository;
import com.springboot.TomaTask.repository.TaskRepository;
import com.springboot.TomaTask.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    private final TaskRepository taskRepository;
    private final SprintRepository sprintRepository;
    private final UserRepository userRepository;

    public DashboardService(TaskRepository taskRepository, SprintRepository sprintRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.sprintRepository = sprintRepository;
        this.userRepository = userRepository;
    }

    /**
     * Get KPIs for a specific user (personal dashboard)
     *
     * @param userId   The user ID to filter tasks
     * @param sprintId Optional sprint ID filter (null = all sprints)
     * @return DashboardResponseDTO with user-specific KPIs
     */
    public DashboardResponseDTO getUserKpis(String userId, String sprintId) {
        List<Task> tasks = getFilteredTasks(userId, sprintId);
        KpiDTO kpis = calculateKpis(tasks);

        String sprintName = sprintId != null
                ? sprintRepository.findById(sprintId)
                        .map(Sprint::getDescription)
                        .orElse("All Sprints")
                : "All Sprints";

        return new DashboardResponseDTO(kpis, "user", userId, sprintId, sprintName);
    }

    /**
     * Get KPIs for all users (manager dashboard)
     *
     * @param sprintId Optional sprint ID filter (null = all sprints)
     * @return DashboardResponseDTO with team-wide KPIs
     */
    public DashboardResponseDTO getManagerKpis(String sprintId) {
        List<Task> tasks = getFilteredTasks(null, sprintId);
        KpiDTO kpis = calculateKpis(tasks);

        String sprintName = sprintId != null
                ? sprintRepository.findById(sprintId)
                        .map(Sprint::getDescription)
                        .orElse("All Sprints")
                : "All Sprints";

        // Calculate previous sprint KPIs if a specific sprint is selected
        KpiDTO previousSprintKpis = null;
        if (sprintId != null) {
            String previousSprintId = getPreviousSprintId(sprintId);
            if (previousSprintId != null) {
                List<Task> previousTasks = getFilteredTasks(null, previousSprintId);
                previousSprintKpis = calculateKpis(previousTasks);
            }
        }

        return new DashboardResponseDTO(kpis, "manager", null, sprintId, sprintName, previousSprintKpis);
    }

    /**
     * Filter tasks by user and/or sprint
     */
    private List<Task> getFilteredTasks(String userId, String sprintId) {
        List<Task> tasks;

        if (userId != null && sprintId != null) {
            // Filter by both user and sprint
            tasks = taskRepository.findAll().stream()
                    .filter(t -> t.getUser() != null && t.getUser().getId().equals(userId))
                    .filter(t -> t.getSprint() != null && t.getSprint().getId().equals(sprintId))
                    .collect(Collectors.toList());
        } else if (userId != null) {
            // Filter by user only (all sprints)
            tasks = taskRepository.findByUserId(userId);
        } else if (sprintId != null) {
            // Filter by sprint only (all users)
            tasks = taskRepository.findBySprintId(sprintId);
        } else {
            // All tasks
            tasks = taskRepository.findAll();
        }

        return tasks;
    }

    /**
     * Calculate all KPIs from a list of tasks
     */
    private KpiDTO calculateKpis(List<Task> tasks) {
        KpiDTO kpis = new KpiDTO();

        // Total tasks
        long totalTasks = tasks.size();
        kpis.setTotalTasks(totalTasks);

        if (totalTasks == 0) {
            // Return empty KPIs if no tasks
            kpis.setOnTimeCompletionRate(0.0);
            kpis.setIncompleteTasks(0L);
            kpis.setLateDeliveries(0L);
            kpis.setAvgHoursByEstimation(new HashMap<>());
            kpis.setCompletionRate(0.0);
            kpis.setCompletedTasks(0L);
            kpis.setOnTimeTasks(0L);
            return kpis;
        }

        // Completed tasks (status = DONE)
        long completedTasks = tasks.stream()
                .filter(t -> t.getStatus() == Task.Status.DONE)
                .count();
        kpis.setCompletedTasks(completedTasks);

        // On-time tasks (DONE and deliveryDate <= endDate)
        long onTimeTasks = tasks.stream()
                .filter(t -> t.getStatus() == Task.Status.DONE)
                .filter(t -> t.getDeliveryDate() != null && t.getEndDate() != null)
                .filter(t -> !t.getDeliveryDate().isAfter(t.getEndDate()))
                .count();
        kpis.setOnTimeTasks(onTimeTasks);

        // On-Time Completion Rate
        double onTimeRate = completedTasks > 0
                ? (double) onTimeTasks / completedTasks * 100.0
                : 0.0;
        kpis.setOnTimeCompletionRate(Math.round(onTimeRate * 100.0) / 100.0);

        // Incomplete tasks (TODO, IN_PROGRESS, PENDING, TESTING)
        long incompleteTasks = tasks.stream()
                .filter(t -> t.getStatus() != Task.Status.DONE)
                .count();
        kpis.setIncompleteTasks(incompleteTasks);

        // Late deliveries (DONE but deliveryDate > endDate)
        long lateDeliveries = tasks.stream()
                .filter(t -> t.getStatus() == Task.Status.DONE)
                .filter(t -> t.getDeliveryDate() != null && t.getEndDate() != null)
                .filter(t -> t.getDeliveryDate().isAfter(t.getEndDate()))
                .count();
        kpis.setLateDeliveries(lateDeliveries);

        // Completion Rate
        double completionRate = (double) completedTasks / totalTasks * 100.0;
        kpis.setCompletionRate(Math.round(completionRate * 100.0) / 100.0);

        // Average Hours by Estimation (actual timeTaken)
        Map<String, Double> avgHoursByEstimation = calculateAvgHoursByEstimation(tasks);
        kpis.setAvgHoursByEstimation(avgHoursByEstimation);

        // Average Expected Hours by Estimation (timeEstimate)
        Map<String, Double> avgExpectedHoursByEstimation = calculateAvgExpectedHoursByEstimation(tasks);
        kpis.setAvgExpectedHoursByEstimation(avgExpectedHoursByEstimation);

        // Total Invested Hours (sum of all timeTaken)
        double totalInvestedHours = tasks.stream()
                .filter(t -> t.getTimeTaken() != null)
                .mapToInt(Task::getTimeTaken)
                .sum();
        kpis.setTotalInvestedHours(Math.round(totalInvestedHours * 100.0) / 100.0);

        // Total Expected Hours (sum of all timeEstimate)
        double totalExpectedHours = tasks.stream()
                .filter(t -> t.getTimeEstimate() != null)
                .mapToInt(Task::getTimeEstimate)
                .sum();
        kpis.setTotalExpectedHours(Math.round(totalExpectedHours * 100.0) / 100.0);

        return kpis;
    }

    /**
     * Calculate average timeTaken grouped by estimation (XS, S, M, L, XL, XXL)
     */
    private Map<String, Double> calculateAvgHoursByEstimation(List<Task> tasks) {
        Map<String, Double> avgHours = new HashMap<>();

        // Filter tasks that have both estimation and timeTaken
        List<Task> validTasks = tasks.stream()
                .filter(t -> t.getEstimation() != null && t.getTimeTaken() != null)
                .collect(Collectors.toList());

        if (validTasks.isEmpty()) {
            return avgHours;
        }

        // Group by estimation and calculate average
        for (Task.Estimation estimation : Task.Estimation.values()) {
            List<Task> tasksForEstimation = validTasks.stream()
                    .filter(t -> t.getEstimation() == estimation)
                    .collect(Collectors.toList());

            if (!tasksForEstimation.isEmpty()) {
                double average = tasksForEstimation.stream()
                        .mapToInt(Task::getTimeTaken)
                        .average()
                        .orElse(0.0);

                avgHours.put(estimation.name(), Math.round(average * 100.0) / 100.0);
            }
        }

        return avgHours;
    }

    /**
     * Calculate average timeEstimate grouped by estimation (XS, S, M, L, XL, XXL)
     */
    private Map<String, Double> calculateAvgExpectedHoursByEstimation(List<Task> tasks) {
        Map<String, Double> avgExpectedHours = new HashMap<>();

        // Filter tasks that have both estimation and timeEstimate
        List<Task> validTasks = tasks.stream()
                .filter(t -> t.getEstimation() != null && t.getTimeEstimate() != null)
                .collect(Collectors.toList());

        if (validTasks.isEmpty()) {
            return avgExpectedHours;
        }

        // Group by estimation and calculate average
        for (Task.Estimation estimation : Task.Estimation.values()) {
            List<Task> tasksForEstimation = validTasks.stream()
                    .filter(t -> t.getEstimation() == estimation)
                    .collect(Collectors.toList());

            if (!tasksForEstimation.isEmpty()) {
                double average = tasksForEstimation.stream()
                        .mapToInt(Task::getTimeEstimate)
                        .average()
                        .orElse(0.0);

                avgExpectedHours.put(estimation.name(), Math.round(average * 100.0) / 100.0);
            }
        }

        return avgExpectedHours;
    }

    /**
     * Gráfica 1: Get total hours worked per sprint
     * Returns hours invested for each sprint
     */
    public List<SprintHoursDTO> getTotalHoursBySprint() {
        List<Sprint> sprints = sprintRepository.findAll();
        List<SprintHoursDTO> result = new ArrayList<>();

        for (Sprint sprint : sprints) {
            List<Task> sprintTasks = taskRepository.findBySprintId(sprint.getId());

            // Sum all timeTaken values for tasks in this sprint
            double totalHours = sprintTasks.stream()
                    .filter(t -> t.getTimeTaken() != null)
                    .mapToInt(Task::getTimeTaken)
                    .sum();

            result.add(new SprintHoursDTO(
                    sprint.getId(),
                    sprint.getDescription(),
                    totalHours
            ));
        }

        // Sort by sprint name (natural order)
        result.sort(Comparator.comparing(SprintHoursDTO::getSprintName));

        return result;
    }

    /**
     * Gráfica 2: Get hours worked by developer per sprint
     * Returns grouped bar chart data
     */
    public List<DeveloperMetricDTO> getHoursByDeveloperPerSprint() {
        List<User> developers = userRepository.findAll();
        List<Sprint> sprints = sprintRepository.findAll();
        List<DeveloperMetricDTO> result = new ArrayList<>();

        for (User developer : developers) {
            Map<String, Double> hoursBySprint = new HashMap<>();

            for (Sprint sprint : sprints) {
                List<Task> tasks = taskRepository.findAll().stream()
                        .filter(t -> t.getUser() != null && t.getUser().getId().equals(developer.getId()))
                        .filter(t -> t.getSprint() != null && t.getSprint().getId().equals(sprint.getId()))
                        .collect(Collectors.toList());

                double totalHours = tasks.stream()
                        .filter(t -> t.getTimeTaken() != null)
                        .mapToInt(Task::getTimeTaken)
                        .sum();

                if (totalHours > 0) {
                    hoursBySprint.put(sprint.getDescription(), totalHours);
                }
            }

            if (!hoursBySprint.isEmpty()) {
                result.add(new DeveloperMetricDTO(
                        developer.getId(),
                        developer.getName(),
                        hoursBySprint
                ));
            }
        }

        return result;
    }

    /**
     * Gráfica 3: Get tasks completed by developer per sprint
     * Returns grouped bar chart data
     */
    public List<DeveloperMetricDTO> getTasksByDeveloperPerSprint() {
        List<User> developers = userRepository.findAll();
        List<Sprint> sprints = sprintRepository.findAll();
        List<DeveloperMetricDTO> result = new ArrayList<>();

        for (User developer : developers) {
            Map<String, Double> tasksBySprint = new HashMap<>();

            for (Sprint sprint : sprints) {
                long completedTasks = taskRepository.findAll().stream()
                        .filter(t -> t.getUser() != null && t.getUser().getId().equals(developer.getId()))
                        .filter(t -> t.getSprint() != null && t.getSprint().getId().equals(sprint.getId()))
                        .filter(t -> t.getStatus() == Task.Status.DONE)
                        .count();

                if (completedTasks > 0) {
                    tasksBySprint.put(sprint.getDescription(), (double) completedTasks);
                }
            }

            if (!tasksBySprint.isEmpty()) {
                result.add(new DeveloperMetricDTO(
                        developer.getId(),
                        developer.getName(),
                        tasksBySprint
                ));
            }
        }

        return result;
    }

    /**
     * Get tasks report for the last sprint
     * Returns completed tasks sorted by developer name
     */
    public List<TaskReportDTO> getLastSprintTasksReport() {
        // Find the most recent sprint by description (assumes "Sprint X" naming)
        List<Sprint> sprints = sprintRepository.findAll();
        if (sprints.isEmpty()) {
            return new ArrayList<>();
        }

        // Sort sprints by description and get the last one
        Sprint lastSprint = sprints.stream()
                .sorted((s1, s2) -> {
                    String desc1 = s1.getDescription();
                    String desc2 = s2.getDescription();
                    // Extract sprint number from "Sprint X - Description"
                    int num1 = extractSprintNumber(desc1);
                    int num2 = extractSprintNumber(desc2);
                    return Integer.compare(num2, num1); // Descending order
                })
                .findFirst()
                .orElse(sprints.get(sprints.size() - 1));

        // Get all completed tasks from the last sprint
        List<Task> tasks = taskRepository.findBySprintId(lastSprint.getId()).stream()
                .filter(t -> t.getStatus() == Task.Status.DONE)
                .collect(Collectors.toList());

        // Convert to DTOs and sort by developer name
        List<TaskReportDTO> report = tasks.stream()
                .map(task -> new TaskReportDTO(
                        task.getId(),
                        task.getName(),
                        task.getUser() != null ? task.getUser().getName() : "Unassigned",
                        task.getTimeEstimate(),
                        task.getTimeTaken(),
                        task.getStatus().name()
                ))
                .sorted(Comparator.comparing(TaskReportDTO::getDeveloperName))
                .collect(Collectors.toList());

        return report;
    }

    /**
     * Extract sprint number from description like "Sprint 1 - Description"
     */
    private int extractSprintNumber(String description) {
        if (description == null) return 0;
        try {
            // Match pattern "Sprint X" where X is a number
            String[] parts = description.split(" ");
            if (parts.length >= 2 && parts[0].equalsIgnoreCase("Sprint")) {
                // Remove any non-digit characters from the second part
                String numberPart = parts[1].replaceAll("[^0-9]", "");
                return Integer.parseInt(numberPart);
            }
        } catch (NumberFormatException e) {
            return 0;
        }
        return 0;
    }

    /**
     * Get the ID of the previous sprint based on sprint number
     * @param currentSprintId The current sprint ID
     * @return The ID of the previous sprint, or null if not found
     */
    private String getPreviousSprintId(String currentSprintId) {
        Optional<Sprint> currentSprintOpt = sprintRepository.findById(currentSprintId);
        if (!currentSprintOpt.isPresent()) {
            return null;
        }

        Sprint currentSprint = currentSprintOpt.get();
        int currentSprintNumber = extractSprintNumber(currentSprint.getDescription());

        if (currentSprintNumber <= 1) {
            return null; // No previous sprint
        }

        int previousSprintNumber = currentSprintNumber - 1;

        // Find sprint with the previous sprint number
        List<Sprint> allSprints = sprintRepository.findAll();
        return allSprints.stream()
                .filter(sprint -> extractSprintNumber(sprint.getDescription()) == previousSprintNumber)
                .map(Sprint::getId)
                .findFirst()
                .orElse(null);
    }
}
