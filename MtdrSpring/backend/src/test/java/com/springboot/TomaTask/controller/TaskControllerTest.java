package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.dto.TaskDTO;
import com.springboot.TomaTask.model.Task;
import com.springboot.TomaTask.service.TaskService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Test-Driven Development (TDD) tests for TaskController
 * Following Red-Green-Refactor workflow
 *
 * Test Coverage:
 * - Feature 1: Create Task (HTTP endpoints, status codes, error handling)
 * - Feature 2: View Completed Tasks for Sprint (will be added in Phase 2)
 * - Feature 3: View Completed Tasks of User in Sprint (will be added in Phase 3)
 *
 * Edge Cases Covered:
 * - HTTP status codes (200 OK, 201 CREATED, 400 BAD REQUEST, 404 NOT FOUND)
 * - Response body validation
 * - Empty result sets
 * - Exception handling from service layer
 */
@ExtendWith(MockitoExtension.class)
public class TaskControllerTest {

    @Mock
    private TaskService taskService;

    @InjectMocks
    private TaskController taskController;

    private TaskDTO taskDTO1;
    private TaskDTO taskDTO2;
    private TaskDTO taskDTO3;

    @BeforeEach
    void setUp() {
        // GIVEN: Setup test DTOs (real objects, not mocks)

        taskDTO1 = new TaskDTO();
        taskDTO1.setId("task-1");
        taskDTO1.setName("Task 1");
        taskDTO1.setDescription("Task 1 description");
        taskDTO1.setStatus(Task.Status.TODO);
        taskDTO1.setTimeEstimate(5);
        taskDTO1.setSprintId("sprint-1");

        taskDTO2 = new TaskDTO();
        taskDTO2.setId("task-2");
        taskDTO2.setName("Task 2");
        taskDTO2.setDescription("Task 2 description");
        taskDTO2.setStatus(Task.Status.DONE);
        taskDTO2.setTimeEstimate(3);
        taskDTO2.setSprintId("sprint-1");

        taskDTO3 = new TaskDTO();
        taskDTO3.setId("task-3");
        taskDTO3.setName("Task 3");
        taskDTO3.setStatus(Task.Status.IN_PROGRESS);
        taskDTO3.setTimeEstimate(8);
    }

    // ========================================================================
    // FEATURE 1: CREATE TASK CONTROLLER TESTS
    // ========================================================================

    /**
     * Test: POST /api/tasks returns 201 CREATED
     * Edge Case: Successful task creation
     * Expected: HTTP 201 status with created task in body
     */
    @Test
    void testCreateTask_Returns201Created() {
        // GIVEN: Service returns created task
        TaskDTO newTask = new TaskDTO();
        newTask.setName("New Task");
        newTask.setStatus(Task.Status.TODO);

        when(taskService.createTask(any(TaskDTO.class))).thenReturn(taskDTO1);

        // WHEN: Creating task via controller
        ResponseEntity<TaskDTO> response = taskController.createTask(newTask);

        // THEN: Response is 201 CREATED with task body
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Task 1", response.getBody().getName());
        verify(taskService, times(1)).createTask(newTask);
    }

    /**
     * Test: POST /api/tasks returns created task DTO
     * Edge Case: Verify response body contains all task fields
     * Expected: Full task DTO returned
     */
    @Test
    void testCreateTask_ReturnsTaskDTO() {
        // GIVEN: Task with all fields
        TaskDTO fullTask = new TaskDTO();
        fullTask.setName("Full Task");
        fullTask.setDescription("Complete description");
        fullTask.setStatus(Task.Status.TODO);
        fullTask.setTimeEstimate(10);
        fullTask.setStartDate(LocalDate.of(2025, 1, 15));
        fullTask.setEndDate(LocalDate.of(2025, 1, 30));

        TaskDTO createdTask = new TaskDTO();
        createdTask.setId("task-new");
        createdTask.setName("Full Task");
        createdTask.setDescription("Complete description");
        createdTask.setStatus(Task.Status.TODO);
        createdTask.setTimeEstimate(10);
        createdTask.setStartDate(LocalDate.of(2025, 1, 15));
        createdTask.setEndDate(LocalDate.of(2025, 1, 30));

        when(taskService.createTask(fullTask)).thenReturn(createdTask);

        // WHEN: Creating task
        ResponseEntity<TaskDTO> response = taskController.createTask(fullTask);

        // THEN: All fields are preserved in response
        assertNotNull(response.getBody());
        assertEquals("task-new", response.getBody().getId());
        assertEquals("Full Task", response.getBody().getName());
        assertEquals("Complete description", response.getBody().getDescription());
        assertEquals(Task.Status.TODO, response.getBody().getStatus());
        assertEquals(10, response.getBody().getTimeEstimate());
        assertEquals(LocalDate.of(2025, 1, 15), response.getBody().getStartDate());
        assertEquals(LocalDate.of(2025, 1, 30), response.getBody().getEndDate());
        verify(taskService, times(1)).createTask(fullTask);
    }

    /**
     * Test: POST /api/tasks with invalid UserStory ID
     * Edge Case: Service throws RuntimeException for invalid relationship
     * Expected: Exception propagates to controller (will be handled by global exception handler)
     */
    @Test
    void testCreateTask_WithInvalidUserStoryId_ThrowsException() {
        // GIVEN: Task with invalid UserStory ID
        TaskDTO invalidTask = new TaskDTO();
        invalidTask.setName("Task with Invalid Story");
        invalidTask.setStatus(Task.Status.TODO);
        invalidTask.setUserStoryId("non-existent");

        when(taskService.createTask(invalidTask))
            .thenThrow(new RuntimeException("UserStory not found with ID: non-existent"));

        // WHEN & THEN: Exception is thrown
        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            taskController.createTask(invalidTask)
        );

        assertEquals("UserStory not found with ID: non-existent", ex.getMessage());
        verify(taskService, times(1)).createTask(invalidTask);
    }

    /**
     * Test: POST /api/tasks with invalid Sprint ID
     * Edge Case: Service throws RuntimeException for invalid Sprint
     * Expected: Exception propagates to controller
     */
    @Test
    void testCreateTask_WithInvalidSprintId_ThrowsException() {
        // GIVEN: Task with invalid Sprint ID
        TaskDTO invalidTask = new TaskDTO();
        invalidTask.setName("Task with Invalid Sprint");
        invalidTask.setStatus(Task.Status.TODO);
        invalidTask.setSprintId("non-existent");

        when(taskService.createTask(invalidTask))
            .thenThrow(new RuntimeException("Sprint not found with ID: non-existent"));

        // WHEN & THEN: Exception is thrown
        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            taskController.createTask(invalidTask)
        );

        assertEquals("Sprint not found with ID: non-existent", ex.getMessage());
        verify(taskService, times(1)).createTask(invalidTask);
    }

    /**
     * Test: POST /api/tasks with invalid Assignee ID
     * Edge Case: Service throws RuntimeException for invalid User
     * Expected: Exception propagates to controller
     */
    @Test
    void testCreateTask_WithInvalidAssigneeId_ThrowsException() {
        // GIVEN: Task with invalid Assignee ID
        TaskDTO invalidTask = new TaskDTO();
        invalidTask.setName("Task with Invalid Assignee");
        invalidTask.setStatus(Task.Status.TODO);
        invalidTask.setAssigneeId("non-existent");

        when(taskService.createTask(invalidTask))
            .thenThrow(new RuntimeException("User not found with ID: non-existent"));

        // WHEN & THEN: Exception is thrown
        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            taskController.createTask(invalidTask)
        );

        assertEquals("User not found with ID: non-existent", ex.getMessage());
        verify(taskService, times(1)).createTask(invalidTask);
    }

    // ========================================================================
    // ADDITIONAL CRUD TESTS (Supporting Feature 1)
    // ========================================================================

    /**
     * Test: GET /api/tasks returns all tasks
     * Edge Case: Multiple tasks exist
     * Expected: HTTP 200 with list of tasks
     */
    @Test
    void testGetAllTasks() {
        // GIVEN: Multiple tasks exist
        when(taskService.getAllTasks()).thenReturn(Arrays.asList(taskDTO1, taskDTO2, taskDTO3));

        // WHEN: Getting all tasks
        ResponseEntity<List<TaskDTO>> response = taskController.getAllTasks();

        // THEN: All tasks returned with 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(3, response.getBody().size());
        verify(taskService, times(1)).getAllTasks();
    }

    /**
     * Test: GET /api/tasks when no tasks exist
     * Edge Case: Empty database
     * Expected: HTTP 200 with empty list
     */
    @Test
    void testGetAllTasks_WhenEmpty() {
        // GIVEN: No tasks exist
        when(taskService.getAllTasks()).thenReturn(Collections.emptyList());

        // WHEN: Getting all tasks
        ResponseEntity<List<TaskDTO>> response = taskController.getAllTasks();

        // THEN: Empty list returned with 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(0, response.getBody().size());
        verify(taskService, times(1)).getAllTasks();
    }

    /**
     * Test: GET /api/tasks/{id} returns task
     * Edge Case: Task exists
     * Expected: HTTP 200 with task DTO
     */
    @Test
    void testGetTaskById() {
        // GIVEN: Task exists
        when(taskService.getTaskById("task-1")).thenReturn(taskDTO1);

        // WHEN: Getting task by ID
        ResponseEntity<TaskDTO> response = taskController.getTaskById("task-1");

        // THEN: Task returned with 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Task 1", response.getBody().getName());
        verify(taskService, times(1)).getTaskById("task-1");
    }

    /**
     * Test: GET /api/tasks/{id} when task doesn't exist
     * Edge Case: Invalid ID
     * Expected: RuntimeException thrown
     */
    @Test
    void testGetTaskById_NotFound_ThrowsException() {
        // GIVEN: Task does not exist
        when(taskService.getTaskById("non-existent"))
            .thenThrow(new RuntimeException("Task not found with ID: non-existent"));

        // WHEN & THEN: Exception is thrown
        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            taskController.getTaskById("non-existent")
        );

        assertEquals("Task not found with ID: non-existent", ex.getMessage());
        verify(taskService, times(1)).getTaskById("non-existent");
    }

    /**
     * Test: PUT /api/tasks/{id} updates task
     * Edge Case: Successful update
     * Expected: HTTP 200 with updated task
     */
    @Test
    void testUpdateTask() {
        // GIVEN: Task exists and is updated
        TaskDTO updatedTask = new TaskDTO();
        updatedTask.setName("Updated Task");
        updatedTask.setDescription("Updated description");
        updatedTask.setStatus(Task.Status.IN_PROGRESS);

        when(taskService.updateTask(eq("task-1"), any(TaskDTO.class))).thenReturn(updatedTask);

        // WHEN: Updating task
        ResponseEntity<TaskDTO> response = taskController.updateTask("task-1", updatedTask);

        // THEN: Updated task returned with 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Updated Task", response.getBody().getName());
        assertEquals(Task.Status.IN_PROGRESS, response.getBody().getStatus());
        verify(taskService, times(1)).updateTask(eq("task-1"), eq(updatedTask));
    }

    /**
     * Test: PUT /api/tasks/{id} when task doesn't exist
     * Edge Case: Invalid ID for update
     * Expected: RuntimeException thrown
     */
    @Test
    void testUpdateTask_NotFound_ThrowsException() {
        // GIVEN: Task does not exist
        TaskDTO updateData = new TaskDTO();
        updateData.setName("Update Non-existent");

        when(taskService.updateTask(eq("non-existent"), any(TaskDTO.class)))
            .thenThrow(new RuntimeException("Task not found with ID: non-existent"));

        // WHEN & THEN: Exception is thrown
        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            taskController.updateTask("non-existent", updateData)
        );

        assertEquals("Task not found with ID: non-existent", ex.getMessage());
        verify(taskService, times(1)).updateTask(eq("non-existent"), eq(updateData));
    }

    /**
     * Test: DELETE /api/tasks/{id} deletes task
     * Edge Case: Successful deletion
     * Expected: HTTP 204 NO CONTENT
     */
    @Test
    void testDeleteTask() {
        // GIVEN: Task exists
        doNothing().when(taskService).deleteTask("task-1");

        // WHEN: Deleting task
        ResponseEntity<Void> response = taskController.deleteTask("task-1");

        // THEN: 204 NO CONTENT returned
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
        verify(taskService, times(1)).deleteTask("task-1");
    }

    /**
     * Test: GET /api/tasks/sprint/{sprintId} returns tasks for sprint
     * Edge Case: Sprint has multiple tasks
     * Expected: HTTP 200 with list of tasks
     */
    @Test
    void testGetTasksBySprintId() {
        // GIVEN: Sprint has tasks
        when(taskService.getTasksBySprintId("sprint-1"))
            .thenReturn(Arrays.asList(taskDTO1, taskDTO2));

        // WHEN: Getting tasks by sprint
        ResponseEntity<List<TaskDTO>> response = taskController.getTasksBySprintId("sprint-1");

        // THEN: Tasks returned with 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        verify(taskService, times(1)).getTasksBySprintId("sprint-1");
    }

    /**
     * Test: GET /api/tasks/sprint/{sprintId} when no tasks
     * Edge Case: Sprint has zero tasks
     * Expected: HTTP 200 with empty list
     */
    @Test
    void testGetTasksBySprintId_WhenEmpty() {
        // GIVEN: Sprint has no tasks
        when(taskService.getTasksBySprintId("sprint-empty"))
            .thenReturn(Collections.emptyList());

        // WHEN: Getting tasks by sprint
        ResponseEntity<List<TaskDTO>> response = taskController.getTasksBySprintId("sprint-empty");

        // THEN: Empty list returned with 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(0, response.getBody().size());
        verify(taskService, times(1)).getTasksBySprintId("sprint-empty");
    }

    /**
     * Test: GET /api/tasks/user-story/{userStoryId} returns tasks for user story
     * Edge Case: UserStory has tasks
     * Expected: HTTP 200 with list of tasks
     */
    @Test
    void testGetTasksByUserStoryId() {
        // GIVEN: UserStory has tasks
        when(taskService.getTasksByUserStoryId("story-1"))
            .thenReturn(Arrays.asList(taskDTO1));

        // WHEN: Getting tasks by user story
        ResponseEntity<List<TaskDTO>> response = taskController.getTasksByUserStoryId("story-1");

        // THEN: Tasks returned with 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(taskService, times(1)).getTasksByUserStoryId("story-1");
    }

    /**
     * Test: GET /api/tasks/assignee/{assigneeId} returns tasks for assignee
     * Edge Case: User has assigned tasks
     * Expected: HTTP 200 with list of tasks
     */
    @Test
    void testGetTasksByAssigneeId() {
        // GIVEN: User has assigned tasks
        when(taskService.getTasksByAssigneeId("user-1"))
            .thenReturn(Arrays.asList(taskDTO1, taskDTO3));

        // WHEN: Getting tasks by assignee
        ResponseEntity<List<TaskDTO>> response = taskController.getTasksByAssigneeId("user-1");

        // THEN: Tasks returned with 200 OK
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        verify(taskService, times(1)).getTasksByAssigneeId("user-1");
    }

    // ========================================================================
    // FEATURE 2: VIEW COMPLETED TASKS FOR SPRINT CONTROLLER TESTS
    // ========================================================================

    /**
     * Test: GET /api/tasks/sprint/{sprintId}/completed returns completed tasks
     * Edge Case: Sprint has multiple completed tasks
     * Expected: HTTP 200 with list of completed tasks
     */
    @Test
    void testGetCompletedTasksBySprintId_Returns200WithTasks() {
        // GIVEN: Sprint has completed tasks
        TaskDTO completedTask1 = new TaskDTO();
        completedTask1.setId("task-done-1");
        completedTask1.setName("Completed Task 1");
        completedTask1.setStatus(Task.Status.DONE);
        completedTask1.setSprintId("sprint-1");

        TaskDTO completedTask2 = new TaskDTO();
        completedTask2.setId("task-done-2");
        completedTask2.setName("Completed Task 2");
        completedTask2.setStatus(Task.Status.DONE);
        completedTask2.setSprintId("sprint-1");

        when(taskService.getCompletedTasksBySprintId("sprint-1"))
            .thenReturn(Arrays.asList(completedTask1, completedTask2));

        // WHEN: Getting completed tasks for sprint
        ResponseEntity<List<TaskDTO>> response = taskController.getCompletedTasksBySprintId("sprint-1");

        // THEN: HTTP 200 with completed tasks
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertEquals(Task.Status.DONE, response.getBody().get(0).getStatus());
        assertEquals(Task.Status.DONE, response.getBody().get(1).getStatus());
        verify(taskService, times(1)).getCompletedTasksBySprintId("sprint-1");
    }

    /**
     * Test: GET /api/tasks/sprint/{sprintId}/completed when no completed tasks
     * Edge Case: Sprint has no DONE tasks
     * Expected: HTTP 200 with empty list
     */
    @Test
    void testGetCompletedTasksBySprintId_WhenEmpty_Returns200WithEmptyList() {
        // GIVEN: Sprint has no completed tasks
        when(taskService.getCompletedTasksBySprintId("sprint-empty"))
            .thenReturn(Collections.emptyList());

        // WHEN: Getting completed tasks
        ResponseEntity<List<TaskDTO>> response = taskController.getCompletedTasksBySprintId("sprint-empty");

        // THEN: HTTP 200 with empty list
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(0, response.getBody().size());
        verify(taskService, times(1)).getCompletedTasksBySprintId("sprint-empty");
    }

    /**
     * Test: GET /api/tasks/sprint/{sprintId}/completed returns only DONE tasks
     * Edge Case: Verify only completed tasks are in response
     * Expected: All tasks in response have DONE status
     */
    @Test
    void testGetCompletedTasksBySprintId_ReturnsOnlyDoneTasks() {
        // GIVEN: Service returns only DONE tasks
        TaskDTO doneTask1 = new TaskDTO();
        doneTask1.setId("task-1");
        doneTask1.setName("Done Task 1");
        doneTask1.setStatus(Task.Status.DONE);

        TaskDTO doneTask2 = new TaskDTO();
        doneTask2.setId("task-2");
        doneTask2.setName("Done Task 2");
        doneTask2.setStatus(Task.Status.DONE);

        when(taskService.getCompletedTasksBySprintId("sprint-1"))
            .thenReturn(Arrays.asList(doneTask1, doneTask2));

        // WHEN: Getting completed tasks
        ResponseEntity<List<TaskDTO>> response = taskController.getCompletedTasksBySprintId("sprint-1");

        // THEN: All returned tasks are DONE
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertTrue(response.getBody().stream().allMatch(task -> task.getStatus() == Task.Status.DONE));
        verify(taskService, times(1)).getCompletedTasksBySprintId("sprint-1");
    }

    /**
     * Test: GET /api/tasks/sprint/{sprintId}/completed for non-existent sprint
     * Edge Case: Sprint ID does not exist
     * Expected: HTTP 200 with empty list (repository returns empty, not exception)
     */
    @Test
    void testGetCompletedTasksBySprintId_ForNonExistentSprint_Returns200Empty() {
        // GIVEN: Sprint does not exist (service returns empty list)
        when(taskService.getCompletedTasksBySprintId("non-existent-sprint"))
            .thenReturn(Collections.emptyList());

        // WHEN: Getting completed tasks for non-existent sprint
        ResponseEntity<List<TaskDTO>> response = taskController.getCompletedTasksBySprintId("non-existent-sprint");

        // THEN: HTTP 200 with empty list (no exception)
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(0, response.getBody().size());
        verify(taskService, times(1)).getCompletedTasksBySprintId("non-existent-sprint");
    }

    // ========================================================================
    // FEATURE 3: VIEW COMPLETED TASKS OF USER IN SPRINT CONTROLLER TESTS
    // ========================================================================

    /**
     * Test: GET /api/tasks/sprint/{sprintId}/user/{userId}/completed returns completed tasks
     * Edge Case: User has multiple completed tasks in sprint
     * Expected: HTTP 200 with list of user's completed tasks
     */
    @Test
    void testGetCompletedTasksBySprintAndUser_Returns200WithTasks() {
        // GIVEN: User has completed tasks in sprint
        TaskDTO userTask1 = new TaskDTO();
        userTask1.setId("task-user-1");
        userTask1.setName("User Task 1");
        userTask1.setStatus(Task.Status.DONE);
        userTask1.setSprintId("sprint-1");
        userTask1.setAssigneeId("user-1");

        TaskDTO userTask2 = new TaskDTO();
        userTask2.setId("task-user-2");
        userTask2.setName("User Task 2");
        userTask2.setStatus(Task.Status.DONE);
        userTask2.setSprintId("sprint-1");
        userTask2.setAssigneeId("user-1");

        when(taskService.getCompletedTasksBySprintIdAndUserId("sprint-1", "user-1"))
            .thenReturn(Arrays.asList(userTask1, userTask2));

        // WHEN: Getting completed tasks for user in sprint
        ResponseEntity<List<TaskDTO>> response = taskController
            .getCompletedTasksBySprintAndUser("sprint-1", "user-1");

        // THEN: HTTP 200 with user's completed tasks
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertEquals(Task.Status.DONE, response.getBody().get(0).getStatus());
        assertEquals(Task.Status.DONE, response.getBody().get(1).getStatus());
        verify(taskService, times(1)).getCompletedTasksBySprintIdAndUserId("sprint-1", "user-1");
    }

    /**
     * Test: GET /api/tasks/sprint/{sprintId}/user/{userId}/completed when no completed tasks
     * Edge Case: User has no DONE tasks in sprint
     * Expected: HTTP 200 with empty list
     */
    @Test
    void testGetCompletedTasksBySprintAndUser_WhenEmpty_Returns200() {
        // GIVEN: User has no completed tasks in sprint
        when(taskService.getCompletedTasksBySprintIdAndUserId("sprint-1", "user-2"))
            .thenReturn(Collections.emptyList());

        // WHEN: Getting completed tasks
        ResponseEntity<List<TaskDTO>> response = taskController
            .getCompletedTasksBySprintAndUser("sprint-1", "user-2");

        // THEN: HTTP 200 with empty list
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(0, response.getBody().size());
        verify(taskService, times(1)).getCompletedTasksBySprintIdAndUserId("sprint-1", "user-2");
    }

    /**
     * Test: GET /api/tasks/sprint/{sprintId}/user/{userId}/completed returns only DONE tasks
     * Edge Case: Verify only completed tasks for specific user are in response
     * Expected: All tasks in response are DONE and belong to user
     */
    @Test
    void testGetCompletedTasksBySprintAndUser_ReturnsOnlyUserDoneTasks() {
        // GIVEN: Service returns only DONE tasks for user
        TaskDTO doneTask1 = new TaskDTO();
        doneTask1.setId("task-1");
        doneTask1.setName("Done Task 1");
        doneTask1.setStatus(Task.Status.DONE);
        doneTask1.setAssigneeId("user-1");

        TaskDTO doneTask2 = new TaskDTO();
        doneTask2.setId("task-2");
        doneTask2.setName("Done Task 2");
        doneTask2.setStatus(Task.Status.DONE);
        doneTask2.setAssigneeId("user-1");

        when(taskService.getCompletedTasksBySprintIdAndUserId("sprint-1", "user-1"))
            .thenReturn(Arrays.asList(doneTask1, doneTask2));

        // WHEN: Getting completed tasks
        ResponseEntity<List<TaskDTO>> response = taskController
            .getCompletedTasksBySprintAndUser("sprint-1", "user-1");

        // THEN: All returned tasks are DONE for the user
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertTrue(response.getBody().stream()
            .allMatch(task -> task.getStatus() == Task.Status.DONE &&
                             "user-1".equals(task.getAssigneeId())));
        verify(taskService, times(1)).getCompletedTasksBySprintIdAndUserId("sprint-1", "user-1");
    }

    /**
     * Test: GET /api/tasks/sprint/{sprintId}/user/{userId}/completed for non-existent user
     * Edge Case: User ID does not exist
     * Expected: HTTP 200 with empty list
     */
    @Test
    void testGetCompletedTasksBySprintAndUser_ForNonExistentUser_Returns200Empty() {
        // GIVEN: User does not exist
        when(taskService.getCompletedTasksBySprintIdAndUserId("sprint-1", "non-existent"))
            .thenReturn(Collections.emptyList());

        // WHEN: Getting completed tasks for non-existent user
        ResponseEntity<List<TaskDTO>> response = taskController
            .getCompletedTasksBySprintAndUser("sprint-1", "non-existent");

        // THEN: HTTP 200 with empty list
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(0, response.getBody().size());
        verify(taskService, times(1)).getCompletedTasksBySprintIdAndUserId("sprint-1", "non-existent");
    }

    /**
     * Test: GET /api/tasks/sprint/{sprintId}/user/{userId}/completed for non-existent sprint
     * Edge Case: Sprint ID does not exist
     * Expected: HTTP 200 with empty list
     */
    @Test
    void testGetCompletedTasksBySprintAndUser_ForNonExistentSprint_Returns200Empty() {
        // GIVEN: Sprint does not exist
        when(taskService.getCompletedTasksBySprintIdAndUserId("non-existent", "user-1"))
            .thenReturn(Collections.emptyList());

        // WHEN: Getting completed tasks for non-existent sprint
        ResponseEntity<List<TaskDTO>> response = taskController
            .getCompletedTasksBySprintAndUser("non-existent", "user-1");

        // THEN: HTTP 200 with empty list
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(0, response.getBody().size());
        verify(taskService, times(1)).getCompletedTasksBySprintIdAndUserId("non-existent", "user-1");
    }
}
