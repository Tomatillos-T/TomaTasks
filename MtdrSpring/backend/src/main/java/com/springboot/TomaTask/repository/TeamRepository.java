package com.springboot.TomaTask.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import jakarta.transaction.Transactional;
import java.util.List;

import com.springboot.TomaTask.model.Team;


@Repository
@Transactional
@EnableTransactionManagement
public interface TeamRepository extends JpaRepository<Team, String> {
    List<Team> findByProjectId(String projectId);
}
