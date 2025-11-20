package com.springboot.TomaTask.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import com.springboot.TomaTask.model.Task;
import jakarta.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
@EnableTransactionManagement
public interface TaskRepository extends JpaRepository<Task, String>, JpaSpecificationExecutor<Task> {
    List<Task> findByStatus(Task.Status status);
    List<Task> findBySprintId(String sprintId);
    List<Task> findByUserStoryId(String userStoryId);
    List<Task> findByUserId(String userId);

    /**
     * Find all tasks for a specific sprint with a specific status
     * @param sprintId the ID of the sprint
     * @param status the task status (e.g., DONE for completed tasks)
     * @return list of tasks matching sprint and status criteria
     */
    List<Task> findBySprintIdAndStatus(String sprintId, Task.Status status);

    /**
     * Find all tasks for a specific sprint, assigned to a specific user, with a specific status
     * @param sprintId the ID of the sprint
     * @param userId the ID of the user (assignee)
     * @param status the task status (e.g., DONE for completed tasks)
     * @return list of tasks matching sprint, user, and status criteria
     */
    List<Task> findBySprintIdAndUserIdAndStatus(String sprintId, String userId, Task.Status status);
}
