package com.springboot.TomaTask.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.springboot.TomaTask.model.Team;
import com.springboot.TomaTask.model.Project;

import javax.transaction.Transactional;
import java.util.Optional;

@Repository
@Transactional
public interface TeamRepository extends JpaRepository<Team, String> {
    Optional<Team> findByProject(Project project);
}
