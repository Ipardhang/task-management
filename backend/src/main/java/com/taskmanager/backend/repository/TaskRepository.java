package com.taskmanager.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskmanager.backend.entity.Task;
import com.taskmanager.backend.entity.User;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUser(User user);
}