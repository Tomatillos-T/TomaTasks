package com.springboot.TomaTask.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.springboot.TomaTask.model.Task;

import javax.transaction.Transactional;

import java.util.List;

@Repository
@Transactional
@EnableTransactionManagement
public interface TaskRepository extends JpaRepository<Task, String> {
    List<Task> findByStatus(String status);
    List<Task> findBySprintId(String sprintId);
}
