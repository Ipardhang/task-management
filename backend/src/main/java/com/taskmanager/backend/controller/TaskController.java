package com.taskmanager.backend.controller;

import com.taskmanager.backend.entity.Task;
import com.taskmanager.backend.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<?> getTasks(
            Authentication authentication) {

        try {

            String email = authentication.getName();

            List<Task> tasks = taskService.getTasks(email);

            return ResponseEntity.ok(tasks);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTask(
            @PathVariable Long id,
            Authentication authentication) {

        try {

            String email = authentication.getName();

            return ResponseEntity.ok(
                    taskService.getTask(id, email)
            );

        } catch (RuntimeException e) {

            return ResponseEntity.status(404).body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @PostMapping
    public ResponseEntity<?> createTask(
            @RequestBody Task task,
            Authentication authentication) {

        try {

            String email = authentication.getName();

            return ResponseEntity.ok(
                    taskService.createTask(task, email)
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(
            @PathVariable Long id,
            @RequestBody Task updatedTask,
            Authentication authentication) {

        try {

            String email = authentication.getName();

            return ResponseEntity.ok(
                    taskService.updateTask(
                            id,
                            updatedTask,
                            email
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.status(404).body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(
            @PathVariable Long id,
            Authentication authentication) {

        try {

            String email = authentication.getName();

            taskService.deleteTask(id, email);

            return ResponseEntity.ok(
                    Map.of("message", "Task deleted successfully")
            );

        } catch (RuntimeException e) {

            return ResponseEntity.status(404).body(
                    Map.of("message", e.getMessage())
            );
        }
    }
}
