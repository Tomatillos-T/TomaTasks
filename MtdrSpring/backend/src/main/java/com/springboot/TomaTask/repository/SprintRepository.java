package com.springboot.TomaTask.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.springboot.TomaTask.model.Sprint;

import java.util.List;


@Repository
public interface SprintRepository extends JpaRepository<Sprint, String> {
    List<Sprint> findByStatus(String status);
}
