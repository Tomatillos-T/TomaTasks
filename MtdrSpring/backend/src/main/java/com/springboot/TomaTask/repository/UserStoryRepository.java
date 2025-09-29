package com.springboot.TomaTask.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.springboot.TomaTask.model.UserStory;

import javax.transaction.Transactional;


@Repository
@Transactional
@EnableTransactionManagement
public interface UserStoryRepository extends JpaRepository<UserStory, Long> {
    UserStory findByName(String name);
}