package com.springboot.TomaTask.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.springboot.TomaTask.model.UserRole;

import jakarta.transaction.Transactional;

@Repository
@Transactional
@EnableTransactionManagement
public interface UserRoleRepository extends JpaRepository<UserRole, String> {
}
