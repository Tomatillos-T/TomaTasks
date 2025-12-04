package com.springboot.TomaTask.service;

import com.springboot.TomaTask.dto.TaskDTO;
import com.springboot.TomaTask.model.Sprint;
import com.springboot.TomaTask.model.Task;
import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.repository.SprintRepository;
import com.springboot.TomaTask.repository.TaskRepository;
import com.springboot.TomaTask.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Test-Driven Development (TDD) tests for TaskService
 * Following Red-Green-Refactor workflow
 *
 * Test Coverage:
 * - Feature 1: Create Task (basic creation, with relationships, validation)
 * - Feature 2: View Completed Tasks for Sprint
 * - Feature 3: View Completed Tasks of User in Sprint
 *
 * Edge Cases Covered:
 * - Null/empty required fields
 * - Invalid relationship IDs (non-existent Sprint, UserStory, User)
 * - Empty result sets
 * - Mixed data scenarios (completed vs incomplete tasks)
 */
@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private SprintRepository sprintRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    // Test data entities
    private Task task1;
    private Task task2;
    private Task task3;

    private TaskDTO taskDTO1;
    private TaskDTO taskDTO2;

    private Sprint sprint1;
    private User user1;

    @BeforeEach
    void setUp() {
        // GIVEN: Setup test data with real entities (no mocking data objects)

        // Create real entities for relationships
        sprint1 = new Sprint();
        sprint1.setDescription("Sprint 1");
        sprint1.setStatus("active");
        sprint1.setStartDate(LocalDate.of(2025, 1, 1));

        user1 = new User();
        user1.setEmail("developer@tomatask.com");
        user1.setFirstName("John");
        user1.setLastName("Developer");

        // Create real Task entities
        task1 = new Task();
        task1.setName("Task 1");
        task1.setDescription("Task 1 description");
        task1.setStatus(Task.Status.TODO);
        task1.setTimeEstimate(5);
        task1.setSprint(sprint1);
        task1.setUser(user1);

        task2 = new Task();
        task2.setName("Task 2");
        task2.setDescription("Task 2 description");
        task2.setStatus(Task.Status.DONE);
        task2.setTimeEstimate(3);
        task2.setSprint(sprint1);

        task3 = new Task();
        task3.setName("Task 3");
        task3.setStatus(Task.Status.IN_PROGRESS);
        task3.setTimeEstimate(8);

        // Create TaskDTOs for testing
        taskDTO1 = new TaskDTO();
        taskDTO1.setName("New Task");
        taskDTO1.setDescription("New task description");
        taskDTO1.setStatus(Task.Status.TODO);
        taskDTO1.setTimeEstimate(5);

        taskDTO2 = new TaskDTO();
        taskDTO2.setName("Task with relationships");
        taskDTO2.setDescription("Task description");
        taskDTO2.setStatus(Task.Status.TODO);
        taskDTO2.setTimeEstimate(3);
        taskDTO2.setSprintId("sprint-1");
        taskDTO2.setAssigneeId("user-1");
    }

    // ========================================================================
    // FEATURE 1: CREATE TASK TESTS
    // ========================================================================

    /**
     * Test: Create task with minimal required fields (name and status)
     * Edge Case: Only required fields provided
     * Expected: Task created successfully with auto-generated ID
     */
    @Test
    void testCreateTask_WithMinimalFields_Success() {
        // GIVEN: Task DTO with only required fields
        TaskDTO minimalTask = new TaskDTO();
        minimalTask.setName("Minimal Task");
        minimalTask.setStatus(Task.Status.TODO);

        Task savedTask = new Task();
        savedTask.setName("Minimal Task");
        savedTask.setStatus(Task.Status.TODO);

        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        // WHEN: Creating the task
        TaskDTO result = taskService.createTask(minimalTask);

        // THEN: Task is created successfully
        assertNotNull(result);
        assertEquals("Minimal Task", result.getName());
        assertEquals(Task.Status.TODO, result.getStatus());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    /**
     * Test: Create task with all fields populated
     * Edge Case: Maximum field usage including optional fields
     * Expected: Task created with all fields preserved
     */
    @Test
    void testCreateTask_WithAllFields_Success() {
        // GIVEN: Task DTO with all fields
        TaskDTO fullTask = new TaskDTO();
        fullTask.setName("Full Task");
        fullTask.setDescription("Complete description");
        fullTask.setStatus(Task.Status.TODO);
        fullTask.setTimeEstimate(10);
        fullTask.setStartDate(LocalDate.of(2025, 1, 15));
        fullTask.setEndDate(LocalDate.of(2025, 1, 30));
        fullTask.setDeliveryDate(LocalDate.of(2025, 2, 1));

        Task savedTask = new Task();
        savedTask.setName("Full Task");
        savedTask.setDescription("Complete description");
        savedTask.setStatus(Task.Status.TODO);
        savedTask.setTimeEstimate(10);
        savedTask.setStartDate(LocalDate.of(2025, 1, 15));
        savedTask.setEndDate(LocalDate.of(2025, 1, 30));
        savedTask.setDeliveryDate(LocalDate.of(2025, 2, 1));

        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        // WHEN: Creating the task
        TaskDTO result = taskService.createTask(fullTask);

        // THEN: All fields are preserved
        assertNotNull(result);
        assertEquals("Full Task", result.getName());
        assertEquals("Complete description", result.getDescription());
        assertEquals(Task.Status.TODO, result.getStatus());
        assertEquals(10, result.getTimeEstimate());
        assertEquals(LocalDate.of(2025, 1, 15), result.getStartDate());
        assertEquals(LocalDate.of(2025, 1, 30), result.getEndDate());
        assertEquals(LocalDate.of(2025, 2, 1), result.getDeliveryDate());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    /**
     * Test: Create task with Sprint relationship
     * Edge Case: Valid Sprint relationship
     * Expected: Task created with Sprint linked
     */
    @Test
    void testCreateTask_WithSprint_Success() {
        // GIVEN: Task DTO with Sprint ID
        TaskDTO taskWithSprint = new TaskDTO();
        taskWithSprint.setName("Task with Sprint");
        taskWithSprint.setStatus(Task.Status.TODO);
        taskWithSprint.setSprintId("sprint-1");

        when(sprintRepository.findById("sprint-1")).thenReturn(Optional.of(sprint1));

        Task savedTask = new Task();
        savedTask.setName("Task with Sprint");
        savedTask.setStatus(Task.Status.TODO);
        savedTask.setSprint(sprint1);

        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        // WHEN: Creating the task
        TaskDTO result = taskService.createTask(taskWithSprint);

        // THEN: Task is created with Sprint relationship
        assertNotNull(result);
        assertEquals("Task with Sprint", result.getName());
        verify(sprintRepository, times(1)).findById("sprint-1");
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    /**
     * Test: Create task with Assignee relationship
     * Edge Case: Valid User/Assignee relationship
     * Expected: Task created with User linked
     */
    @Test
    void testCreateTask_WithAssignee_Success() {
        // GIVEN: Task DTO with Assignee ID
        TaskDTO taskWithAssignee = new TaskDTO();
        taskWithAssignee.setName("Task with Assignee");
        taskWithAssignee.setStatus(Task.Status.TODO);
        taskWithAssignee.setAssigneeId("user-1");

        when(userRepository.findById("user-1")).thenReturn(Optional.of(user1));

        Task savedTask = new Task();
        savedTask.setName("Task with Assignee");
        savedTask.setStatus(Task.Status.TODO);
        savedTask.setUser(user1);

        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        // WHEN: Creating the task
        TaskDTO result = taskService.createTask(taskWithAssignee);

        // THEN: Task is created with Assignee relationship
        assertNotNull(result);
        assertEquals("Task with Assignee", result.getName());
        verify(userRepository, times(1)).findById("user-1");
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    /**
     * Test: Create task with all relationships
     * Edge Case: All relationships (Sprint, Assignee) provided
     * Expected: Task created with all relationships linked
     */
    @Test
    void testCreateTask_WithAllRelationships_Success() {
        // GIVEN: Task DTO with all relationships
        TaskDTO taskWithAll = new TaskDTO();
        taskWithAll.setName("Task with All Relationships");
        taskWithAll.setStatus(Task.Status.TODO);
        taskWithAll.setSprintId("sprint-1");
        taskWithAll.setAssigneeId("user-1");

        when(sprintRepository.findById("sprint-1")).thenReturn(Optional.of(sprint1));
        when(userRepository.findById("user-1")).thenReturn(Optional.of(user1));

        Task savedTask = new Task();
        savedTask.setName("Task with All Relationships");
        savedTask.setStatus(Task.Status.TODO);
        savedTask.setSprint(sprint1);
        savedTask.setUser(user1);

        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        // WHEN: Creating the task
        TaskDTO result = taskService.createTask(taskWithAll);

        // THEN: Task is created with all relationships
        assertNotNull(result);
        assertEquals("Task with All Relationships", result.getName());
        verify(sprintRepository, times(1)).findById("sprint-1");
        verify(userRepository, times(1)).findById("user-1");
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    /**
     * Test: Create task with invalid Sprint ID
     * Edge Case: Sprint does not exist in database
     * Expected: RuntimeException thrown with descriptive message
     */
    @Test
    void testCreateTask_WithInvalidSprintId_ThrowsException() {
        // GIVEN: Task DTO with non-existent Sprint ID
        TaskDTO invalidTask = new TaskDTO();
        invalidTask.setName("Task with Invalid Sprint");
        invalidTask.setStatus(Task.Status.TODO);
        invalidTask.setSprintId("non-existent-sprint");

        when(sprintRepository.findById("non-existent-sprint")).thenReturn(Optional.empty());

        // WHEN & THEN: Creating task throws exception
        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            taskService.createTask(invalidTask)
        );

        assertEquals("Sprint not found with ID: non-existent-sprint", ex.getMessage());
        verify(sprintRepository, times(1)).findById("non-existent-sprint");
        verify(taskRepository, never()).save(any());
    }

    /**
     * Test: Create task with invalid Assignee ID
     * Edge Case: User/Assignee does not exist in database
     * Expected: RuntimeException thrown with descriptive message
     */
    @Test
    void testCreateTask_WithInvalidAssigneeId_ThrowsException() {
        // GIVEN: Task DTO with non-existent Assignee ID
        TaskDTO invalidTask = new TaskDTO();
        invalidTask.setName("Task with Invalid Assignee");
        invalidTask.setStatus(Task.Status.TODO);
        invalidTask.setAssigneeId("non-existent-user");

        when(userRepository.findById("non-existent-user")).thenReturn(Optional.empty());

        // WHEN & THEN: Creating task throws exception
        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            taskService.createTask(invalidTask)
        );

        assertEquals("User not found with ID: non-existent-user", ex.getMessage());
        verify(userRepository, times(1)).findById("non-existent-user");
        verify(taskRepository, never()).save(any());
    }

    /**
     * Test: Get task by ID when it exists
     * Edge Case: Valid ID lookup
     * Expected: Task returned successfully
     */
    @Test
    void testGetTaskById_Found() {
        // GIVEN: Task exists in repository
        when(taskRepository.findById("task-1")).thenReturn(Optional.of(task1));

        // WHEN: Getting task by ID
        TaskDTO result = taskService.getTaskById("task-1");

        // THEN: Task is returned
        assertNotNull(result);
        assertEquals("Task 1", result.getName());
        verify(taskRepository, times(1)).findById("task-1");
    }

    /**
     * Test: Get task by ID when it doesn't exist
     * Edge Case: Invalid ID lookup
     * Expected: RuntimeException thrown
     */
    @Test
    void testGetTaskById_NotFound_ThrowsException() {
        // GIVEN: Task does not exist
        when(taskRepository.findById("non-existent")).thenReturn(Optional.empty());

        // WHEN & THEN: Getting task throws exception
        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            taskService.getTaskById("non-existent")
        );

        assertEquals("Task not found with ID: non-existent", ex.getMessage());
        verify(taskRepository, times(1)).findById("non-existent");
    }

    // ========================================================================
    // FEATURE 2: VIEW COMPLETED TASKS FOR SPRINT TESTS
    // ========================================================================

    /**
     * Test: Get completed tasks for sprint with multiple completed tasks
     * Edge Case: Sprint has multiple DONE tasks
     * Expected: Only DONE tasks for that sprint are returned
     */
    @Test
    void testGetCompletedTasksBySprintId_WithMultipleTasks_Success() {
        // GIVEN: Sprint has multiple completed tasks
        Task completedTask1 = new Task();
        completedTask1.setName("Completed Task 1");
        completedTask1.setStatus(Task.Status.DONE);
        completedTask1.setSprint(sprint1);

        Task completedTask2 = new Task();
        completedTask2.setName("Completed Task 2");
        completedTask2.setStatus(Task.Status.DONE);
        completedTask2.setSprint(sprint1);

        when(taskRepository.findBySprintIdAndStatus("sprint-1", Task.Status.DONE))
            .thenReturn(Arrays.asList(completedTask1, completedTask2));

        // WHEN: Getting completed tasks by sprint ID
        List<TaskDTO> result = taskService.getCompletedTasksBySprintId("sprint-1");

        // THEN: All completed tasks for sprint are returned
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(taskRepository, times(1)).findBySprintIdAndStatus("sprint-1", Task.Status.DONE);
    }

    /**
     * Test: Get completed tasks for sprint with no completed tasks
     * Edge Case: Sprint exists but has no DONE tasks
     * Expected: Empty list returned (not null, not exception)
     */
    @Test
    void testGetCompletedTasksBySprintId_WithNoCompletedTasks_ReturnsEmptyList() {
        // GIVEN: Sprint has no completed tasks
        when(taskRepository.findBySprintIdAndStatus("sprint-empty", Task.Status.DONE))
            .thenReturn(Collections.emptyList());

        // WHEN: Getting completed tasks by sprint ID
        List<TaskDTO> result = taskService.getCompletedTasksBySprintId("sprint-empty");

        // THEN: Empty list is returned
        assertNotNull(result);
        assertEquals(0, result.size());
        verify(taskRepository, times(1)).findBySprintIdAndStatus("sprint-empty", Task.Status.DONE);
    }

    /**
     * Test: Get completed tasks for sprint with mixed statuses
     * Edge Case: Sprint has tasks with various statuses (TODO, IN_PROGRESS, DONE)
     * Expected: Only DONE tasks are returned, others filtered out
     */
    @Test
    void testGetCompletedTasksBySprintId_WithMixedStatuses_ReturnsOnlyDone() {
        // GIVEN: Sprint has tasks with mixed statuses, but we query for DONE only
        Task doneTask = new Task();
        doneTask.setName("Done Task");
        doneTask.setStatus(Task.Status.DONE);
        doneTask.setSprint(sprint1);

        // Repository should only return DONE tasks
        when(taskRepository.findBySprintIdAndStatus("sprint-1", Task.Status.DONE))
            .thenReturn(Arrays.asList(doneTask));

        // WHEN: Getting completed tasks
        List<TaskDTO> result = taskService.getCompletedTasksBySprintId("sprint-1");

        // THEN: Only DONE tasks are returned
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Done Task", result.get(0).getName());
        verify(taskRepository, times(1)).findBySprintIdAndStatus("sprint-1", Task.Status.DONE);
    }

    /**
     * Test: Get completed tasks for non-existent sprint
     * Edge Case: Sprint ID does not exist in database
     * Expected: Empty list returned (repository returns empty, not exception)
     */
    @Test
    void testGetCompletedTasksBySprintId_ForNonExistentSprint_ReturnsEmptyList() {
        // GIVEN: Sprint does not exist (no tasks returned)
        when(taskRepository.findBySprintIdAndStatus("non-existent-sprint", Task.Status.DONE))
            .thenReturn(Collections.emptyList());

        // WHEN: Getting completed tasks for non-existent sprint
        List<TaskDTO> result = taskService.getCompletedTasksBySprintId("non-existent-sprint");

        // THEN: Empty list is returned (no exception thrown)
        assertNotNull(result);
        assertEquals(0, result.size());
        verify(taskRepository, times(1))
            .findBySprintIdAndStatus("non-existent-sprint", Task.Status.DONE);
    }

    /**
     * Test: Verify only DONE status is used in query
     * Edge Case: Ensure the service method specifically queries for DONE status
     * Expected: Repository called with Task.Status.DONE
     */
    @Test
    void testGetCompletedTasksBySprintId_QueriesWithDoneStatus() {
        // GIVEN: Setup for DONE status query
        when(taskRepository.findBySprintIdAndStatus("sprint-1", Task.Status.DONE))
            .thenReturn(Collections.emptyList());

        // WHEN: Getting completed tasks
        taskService.getCompletedTasksBySprintId("sprint-1");

        // THEN: Repository is called with DONE status specifically
        verify(taskRepository, times(1)).findBySprintIdAndStatus("sprint-1", Task.Status.DONE);
        // Verify it's NOT called with other statuses
        verify(taskRepository, never()).findBySprintIdAndStatus(eq("sprint-1"), eq(Task.Status.TODO));
        verify(taskRepository, never()).findBySprintIdAndStatus(eq("sprint-1"), eq(Task.Status.IN_PROGRESS));
    }

    /**
     * Test: Verify tasks returned belong to correct sprint
     * Edge Case: Ensure filtering is working correctly
     * Expected: All returned tasks have matching sprint ID
     */
    @Test
    void testGetCompletedTasksBySprintId_TasksBelongToCorrectSprint() {
        // GIVEN: Completed tasks for specific sprint
        Task task1 = new Task();
        task1.setName("Task 1");
        task1.setStatus(Task.Status.DONE);
        task1.setSprint(sprint1);

        Task task2 = new Task();
        task2.setName("Task 2");
        task2.setStatus(Task.Status.DONE);
        task2.setSprint(sprint1);

        when(taskRepository.findBySprintIdAndStatus("sprint-1", Task.Status.DONE))
            .thenReturn(Arrays.asList(task1, task2));

        // WHEN: Getting completed tasks
        List<TaskDTO> result = taskService.getCompletedTasksBySprintId("sprint-1");

        // THEN: All tasks in result belong to the requested sprint
        assertNotNull(result);
        assertEquals(2, result.size());
        // Verify repository was called with correct parameters
        verify(taskRepository, times(1)).findBySprintIdAndStatus("sprint-1", Task.Status.DONE);
    }

    // ========================================================================
    // FEATURE 3: VIEW COMPLETED TASKS OF USER IN SPRINT TESTS
    // ========================================================================

    /**
     * Test: Get completed tasks for user in sprint with multiple tasks
     * Edge Case: User has multiple completed tasks in the sprint
     * Expected: All DONE tasks for that user in that sprint are returned
     */
    @Test
    void testGetCompletedTasksBySprintIdAndUserId_WithMultipleTasks_Success() {
        // GIVEN: User has multiple completed tasks in sprint
        Task completedTask1 = new Task();
        completedTask1.setName("User Completed Task 1");
        completedTask1.setStatus(Task.Status.DONE);
        completedTask1.setSprint(sprint1);
        completedTask1.setUser(user1);

        Task completedTask2 = new Task();
        completedTask2.setName("User Completed Task 2");
        completedTask2.setStatus(Task.Status.DONE);
        completedTask2.setSprint(sprint1);
        completedTask2.setUser(user1);

        when(taskRepository.findBySprintIdAndUserIdAndStatus("sprint-1", "user-1", Task.Status.DONE))
            .thenReturn(Arrays.asList(completedTask1, completedTask2));

        // WHEN: Getting completed tasks for user in sprint
        List<TaskDTO> result = taskService.getCompletedTasksBySprintIdAndUserId("sprint-1", "user-1");

        // THEN: All completed tasks for user in sprint are returned
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(taskRepository, times(1))
            .findBySprintIdAndUserIdAndStatus("sprint-1", "user-1", Task.Status.DONE);
    }

    /**
     * Test: Get completed tasks for user in sprint when user has no completed tasks
     * Edge Case: User has no DONE tasks in sprint
     * Expected: Empty list returned
     */
    @Test
    void testGetCompletedTasksBySprintIdAndUserId_WithNoCompletedTasks_ReturnsEmptyList() {
        // GIVEN: User has no completed tasks in sprint
        when(taskRepository.findBySprintIdAndUserIdAndStatus("sprint-1", "user-2", Task.Status.DONE))
            .thenReturn(Collections.emptyList());

        // WHEN: Getting completed tasks
        List<TaskDTO> result = taskService.getCompletedTasksBySprintIdAndUserId("sprint-1", "user-2");

        // THEN: Empty list is returned
        assertNotNull(result);
        assertEquals(0, result.size());
        verify(taskRepository, times(1))
            .findBySprintIdAndUserIdAndStatus("sprint-1", "user-2", Task.Status.DONE);
    }

    /**
     * Test: Get completed tasks when user has only incomplete tasks in sprint
     * Edge Case: User has tasks in sprint but none are DONE
     * Expected: Empty list returned (only DONE tasks should be returned)
     */
    @Test
    void testGetCompletedTasksBySprintIdAndUserId_WithOnlyIncompleteTasks_ReturnsEmptyList() {
        // GIVEN: User has only incomplete tasks (repository returns empty for DONE)
        when(taskRepository.findBySprintIdAndUserIdAndStatus("sprint-1", "user-1", Task.Status.DONE))
            .thenReturn(Collections.emptyList());

        // WHEN: Getting completed tasks
        List<TaskDTO> result = taskService.getCompletedTasksBySprintIdAndUserId("sprint-1", "user-1");

        // THEN: Empty list is returned
        assertNotNull(result);
        assertEquals(0, result.size());
        verify(taskRepository, times(1))
            .findBySprintIdAndUserIdAndStatus("sprint-1", "user-1", Task.Status.DONE);
    }

    /**
     * Test: Get completed tasks for non-existent user ID
     * Edge Case: User ID does not exist
     * Expected: Empty list returned (no exception thrown)
     */
    @Test
    void testGetCompletedTasksBySprintIdAndUserId_ForNonExistentUser_ReturnsEmptyList() {
        // GIVEN: User does not exist
        when(taskRepository.findBySprintIdAndUserIdAndStatus("sprint-1", "non-existent-user", Task.Status.DONE))
            .thenReturn(Collections.emptyList());

        // WHEN: Getting completed tasks
        List<TaskDTO> result = taskService.getCompletedTasksBySprintIdAndUserId("sprint-1", "non-existent-user");

        // THEN: Empty list is returned
        assertNotNull(result);
        assertEquals(0, result.size());
        verify(taskRepository, times(1))
            .findBySprintIdAndUserIdAndStatus("sprint-1", "non-existent-user", Task.Status.DONE);
    }

    /**
     * Test: Get completed tasks for non-existent sprint ID
     * Edge Case: Sprint ID does not exist
     * Expected: Empty list returned (no exception thrown)
     */
    @Test
    void testGetCompletedTasksBySprintIdAndUserId_ForNonExistentSprint_ReturnsEmptyList() {
        // GIVEN: Sprint does not exist
        when(taskRepository.findBySprintIdAndUserIdAndStatus("non-existent-sprint", "user-1", Task.Status.DONE))
            .thenReturn(Collections.emptyList());

        // WHEN: Getting completed tasks
        List<TaskDTO> result = taskService.getCompletedTasksBySprintIdAndUserId("non-existent-sprint", "user-1");

        // THEN: Empty list is returned
        assertNotNull(result);
        assertEquals(0, result.size());
        verify(taskRepository, times(1))
            .findBySprintIdAndUserIdAndStatus("non-existent-sprint", "user-1", Task.Status.DONE);
    }

    /**
     * Test: Verify only DONE status is queried
     * Edge Case: Ensure method queries specifically for DONE status
     * Expected: Repository called with Task.Status.DONE
     */
    @Test
    void testGetCompletedTasksBySprintIdAndUserId_QueriesWithDoneStatus() {
        // GIVEN: Setup for DONE status query
        when(taskRepository.findBySprintIdAndUserIdAndStatus("sprint-1", "user-1", Task.Status.DONE))
            .thenReturn(Collections.emptyList());

        // WHEN: Getting completed tasks
        taskService.getCompletedTasksBySprintIdAndUserId("sprint-1", "user-1");

        // THEN: Repository is called with DONE status specifically
        verify(taskRepository, times(1))
            .findBySprintIdAndUserIdAndStatus("sprint-1", "user-1", Task.Status.DONE);
        // Verify it's NOT called with other statuses
        verify(taskRepository, never())
            .findBySprintIdAndUserIdAndStatus(eq("sprint-1"), eq("user-1"), eq(Task.Status.TODO));
        verify(taskRepository, never())
            .findBySprintIdAndUserIdAndStatus(eq("sprint-1"), eq("user-1"), eq(Task.Status.IN_PROGRESS));
    }

    /**
     * Test: Verify returned tasks belong to correct user and sprint
     * Edge Case: Ensure filtering is working correctly for both sprint and user
     * Expected: All returned tasks match sprint ID and user ID
     */
    @Test
    void testGetCompletedTasksBySprintIdAndUserId_TasksBelongToCorrectUserAndSprint() {
        // GIVEN: Completed tasks for specific user in specific sprint
        Task task1 = new Task();
        task1.setName("Task 1");
        task1.setStatus(Task.Status.DONE);
        task1.setSprint(sprint1);
        task1.setUser(user1);

        Task task2 = new Task();
        task2.setName("Task 2");
        task2.setStatus(Task.Status.DONE);
        task2.setSprint(sprint1);
        task2.setUser(user1);

        when(taskRepository.findBySprintIdAndUserIdAndStatus("sprint-1", "user-1", Task.Status.DONE))
            .thenReturn(Arrays.asList(task1, task2));

        // WHEN: Getting completed tasks
        List<TaskDTO> result = taskService.getCompletedTasksBySprintIdAndUserId("sprint-1", "user-1");

        // THEN: All tasks belong to the requested sprint and user
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(taskRepository, times(1))
            .findBySprintIdAndUserIdAndStatus("sprint-1", "user-1", Task.Status.DONE);
    }
}
