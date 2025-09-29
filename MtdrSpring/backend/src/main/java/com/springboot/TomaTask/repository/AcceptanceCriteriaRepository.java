package com.springboot.TomaTask.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.springboot.TomaTask.model.AcceptanceCriteria;

import javax.transaction.Transactional;

@Repository
@Transactional
@EnableTransactionManagement
public interface AcceptanceCriteriaRepository extends JpaRepository<AcceptanceCriteria, Long> {
}
