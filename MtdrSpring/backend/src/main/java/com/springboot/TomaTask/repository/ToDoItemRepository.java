package com.springboot.TomaTask.repository;


import com.springboot.TomaTask.model.ToDoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.transaction.Transactional;

@Repository
@Transactional
@EnableTransactionManagement
public interface ToDoItemRepository extends JpaRepository<ToDoItem,Integer> {


}
