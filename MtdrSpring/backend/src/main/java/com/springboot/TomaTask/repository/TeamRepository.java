package com.springboot.TomaTask.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.springboot.TomaTask.model.Team;

import javax.transaction.Transactional;
import java.util.List;


@Repository
@Transactional
@EnableTransactionManagement
public interface TeamRepository extends JpaRepository<Team, String> {
    List<Team> findByProjectId(String projectId);
}
