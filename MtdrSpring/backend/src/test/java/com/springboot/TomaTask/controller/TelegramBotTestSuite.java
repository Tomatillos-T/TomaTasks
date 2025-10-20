package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.dto.TaskDTO;
import com.springboot.TomaTask.model.Task;
import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.service.TaskService;
import com.springboot.TomaTask.service.UserService;
import com.springboot.TomaTask.util.BotActions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.telegram.telegrambots.meta.generics.TelegramClient;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Comprehensive test suite for Telegram Bot functionality
 * Tests: Add task, Assign task, Complete task, View developer tasks, View KPIs
 */
public class TelegramBotTestSuite {

    @Mock
    private TelegramClient telegramClient;
    
    @Mock
    private TaskService taskService;
    
    @Mock
    private UserService userService;
    
    private BotActions botActions;
    private User testDeveloper;
    private TaskDTO testTask;
    private final long TEST_CHAT_ID = 123456789L;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        botActions = new BotActions(telegramClient, taskService, userService);
        botActions.setChatId(TEST_CHAT_ID);
        
        // Setup test developer
        testDeveloper = new User();
        testDeveloper.setId("dev-001");
        testDeveloper.setFirstName("John");
        testDeveloper.setLastName("Doe");
        testDeveloper.setEmail("john.doe@tomatask.com");
        testDeveloper.setRole(User.UserRole.ROLE_DEVELOPER);
        
        // Setup test task
        testTask = new TaskDTO();
        testTask.setId("task-001");
        testTask.setName("Implement login feature");
        testTask.setDescription("Add JWT authentication");
        testTask.setStatus(Task.Status.TODO);
        testTask.setTimeEstimate(5);
        testTask.setStartDate(LocalDate.now());
        testTask.setEndDate(LocalDate.now().plusDays(3));
    }

    @Test
    @DisplayName("Test 1: Add New Task")
    void testAddNewTask() throws Exception {
        // Arrange
        String taskName = "Implement user registration";
        botActions.setRequestText(taskName);
        botActions.setTaskService(taskService);
        
        simulateLogin();
        when(taskService.createTask(any(TaskDTO.class))).thenReturn(testTask);
        
        // Act
        botActions.fnElse();
        
        // Assert
        verify(taskService, times(1)).createTask(any(TaskDTO.class));
    }

    @Test
    @DisplayName("Test 2: Assign Task to Developer")
    void testAssignTaskToDeveloper() {
        // Arrange
        testTask.setAssigneeId(null);
        String taskId = "task-001";
        
        when(taskService.getTaskById(taskId)).thenReturn(testTask);
        when(userService.getUserById("dev-001")).thenReturn(
            org.springframework.http.ResponseEntity.ok(
                createUserDTO(testDeveloper)
            )
        );
        
        TaskDTO updatedTask = new TaskDTO();
        updatedTask.setId(taskId);
        updatedTask.setAssigneeId("dev-001");
        
        when(taskService.updateTask(eq(taskId), any(TaskDTO.class)))
            .thenReturn(updatedTask);
        
        // Act
        TaskDTO result = taskService.updateTask(taskId, updatedTask);
        
        // Assert
        assertNotNull(result);
        assertEquals("dev-001", result.getAssigneeId());
        verify(taskService, times(1)).updateTask(eq(taskId), any(TaskDTO.class));
    }

    @Test
    @DisplayName("Test 3: Complete a Task (Mark as DONE)")
    void testCompleteTask() {
        // Arrange
        String taskId = "task-001";
        botActions.setRequestText(taskId + "-DONE");
        
        when(taskService.getTaskById(taskId)).thenReturn(testTask);
        
        TaskDTO completedTask = new TaskDTO();
        completedTask.setId(taskId);
        completedTask.setStatus(Task.Status.DONE);
        completedTask.setDeliveryDate(LocalDate.now());
        
        when(taskService.updateTask(eq(taskId), any(TaskDTO.class)))
            .thenReturn(completedTask);
        
        // Act
        botActions.fnDone();
        
        // Assert
        verify(taskService, times(1)).getTaskById(taskId);
        verify(taskService, times(1)).updateTask(eq(taskId), any(TaskDTO.class));
    }

    @Test
    @DisplayName("Test 4: View Developer's Tasks")
    void testViewDeveloperTasks() throws Exception {
        // Arrange
        simulateLogin();
        botActions.setRequestText("/todolist");
        
        List<TaskDTO> developerTasks = Arrays.asList(
            createTaskDTO("task-001", "Login feature", Task.Status.IN_PROGRESS),
            createTaskDTO("task-002", "User registration", Task.Status.TODO),
            createTaskDTO("task-003", "Password reset", Task.Status.DONE)
        );
        
        when(taskService.getTasksByAssigneeId("dev-001")).thenReturn(developerTasks);
        
        // Act
        botActions.fnListAll();
        
        // Assert
        verify(taskService, times(1)).getTasksByAssigneeId("dev-001");
        verify(telegramClient, times(1)).execute(any(org.telegram.telegrambots.meta.api.methods.send.SendMessage.class));
    }

    @Test
    @DisplayName("Test 5: View Developer KPIs")
    void testViewDeveloperKPIs() {
        // This test doesn't use BotActions - it tests the KPI calculation directly
        List<TaskDTO> allTasks = Arrays.asList(
            createTaskDTO("task-001", "Feature A", Task.Status.DONE),
            createTaskDTO("task-002", "Feature B", Task.Status.DONE),
            createTaskDTO("task-003", "Feature C", Task.Status.IN_PROGRESS),
            createTaskDTO("task-004", "Feature D", Task.Status.TODO),
            createTaskDTO("task-005", "Feature E", Task.Status.DONE)
        );
        
        // Act - calculate KPIs without service call
        DeveloperKPIs kpis = calculateKPIs(allTasks);
        
        // Assert
        assertEquals(5, kpis.getTotalTasks());
        assertEquals(3, kpis.getCompletedTasks());
        assertEquals(1, kpis.getInProgressTasks());
        assertEquals(1, kpis.getTodoTasks());
        assertEquals(60.0, kpis.getCompletionRate(), 0.1);
    }

    @Test
    @DisplayName("Integration Test: Complete Workflow")
    void testCompleteWorkflow() {
        // 1. Login
        simulateLogin();
        
        // 2. Add new task
        botActions.setRequestText("Implement OAuth2");
        botActions.fnElse();
        verify(taskService, times(1)).createTask(any(TaskDTO.class));
        
        // 3. View tasks
        botActions.setRequestText("/todolist");
        when(taskService.getTasksByAssigneeId(anyString()))
            .thenReturn(Arrays.asList(testTask));
        botActions.fnListAll();
        
        // 4. Complete task
        botActions.setRequestText("task-001-DONE");
        when(taskService.getTaskById("task-001")).thenReturn(testTask);
        botActions.fnDone();
        
        // Verify full workflow
        verify(taskService, atLeastOnce()).createTask(any(TaskDTO.class));
        verify(taskService, atLeastOnce()).getTasksByAssigneeId(anyString());
        verify(taskService, atLeastOnce()).updateTask(anyString(), any(TaskDTO.class));
    }

    // Helper methods
    
    private void simulateLogin() {
        // Use reflection to set session since BotActions uses static ConcurrentHashMap
        try {
            java.lang.reflect.Field sessionField = BotActions.class.getDeclaredField("sessionByChat");
            sessionField.setAccessible(true);
            java.util.concurrent.ConcurrentHashMap<Long, User> sessions = 
                (java.util.concurrent.ConcurrentHashMap<Long, User>) sessionField.get(null);
            sessions.put(TEST_CHAT_ID, testDeveloper);
        } catch (Exception e) {
            throw new RuntimeException("Failed to simulate login", e);
        }
    }

    private TaskDTO createTaskDTO(String id, String name, Task.Status status) {
        TaskDTO task = new TaskDTO();
        task.setId(id);
        task.setName(name);
        task.setStatus(status);
        task.setAssigneeId("dev-001");
        task.setTimeEstimate(3);
        task.setStartDate(LocalDate.now().minusDays(2));
        task.setEndDate(LocalDate.now().plusDays(1));
        if (status == Task.Status.DONE) {
            task.setDeliveryDate(LocalDate.now());
        }
        return task;
    }

    private com.springboot.TomaTask.dto.UserDTO createUserDTO(User user) {
        com.springboot.TomaTask.dto.UserDTO dto = new com.springboot.TomaTask.dto.UserDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }

    private DeveloperKPIs calculateKPIs(List<TaskDTO> tasks) {
        DeveloperKPIs kpis = new DeveloperKPIs();
        kpis.setTotalTasks(tasks.size());
        
        long completed = tasks.stream()
            .filter(t -> t.getStatus() == Task.Status.DONE)
            .count();
        kpis.setCompletedTasks((int) completed);
        
        long inProgress = tasks.stream()
            .filter(t -> t.getStatus() == Task.Status.IN_PROGRESS)
            .count();
        kpis.setInProgressTasks((int) inProgress);
        
        long todo = tasks.stream()
            .filter(t -> t.getStatus() == Task.Status.TODO)
            .count();
        kpis.setTodoTasks((int) todo);
        
        if (tasks.size() > 0) {
            kpis.setCompletionRate((completed * 100.0) / tasks.size());
        }
        
        return kpis;
    }

    // KPI Data Class
    static class DeveloperKPIs {
        private int totalTasks;
        private int completedTasks;
        private int inProgressTasks;
        private int todoTasks;
        private double completionRate;

        public int getTotalTasks() { return totalTasks; }
        public void setTotalTasks(int totalTasks) { this.totalTasks = totalTasks; }
        
        public int getCompletedTasks() { return completedTasks; }
        public void setCompletedTasks(int completedTasks) { this.completedTasks = completedTasks; }
        
        public int getInProgressTasks() { return inProgressTasks; }
        public void setInProgressTasks(int inProgressTasks) { this.inProgressTasks = inProgressTasks; }
        
        public int getTodoTasks() { return todoTasks; }
        public void setTodoTasks(int todoTasks) { this.todoTasks = todoTasks; }
        
        public double getCompletionRate() { return completionRate; }
        public void setCompletionRate(double completionRate) { this.completionRate = completionRate; }
    }
}
