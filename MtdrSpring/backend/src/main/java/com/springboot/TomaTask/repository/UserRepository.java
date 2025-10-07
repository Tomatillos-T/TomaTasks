package com.springboot.TomaTask.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.springboot.TomaTask.model.User;

import jakarta.transaction.Transactional;

import java.util.Optional;

@Repository
@Transactional
@EnableTransactionManagement
public interface UserRepository extends JpaRepository<User,String> {
    Optional<User> findByEmail(String email);
}
