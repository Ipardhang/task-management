package com.taskmanager.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.taskmanager.backend.entity.Task;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.repository.TaskRepository;
import com.taskmanager.backend.repository.UserRepository;
import com.taskmanager.backend.websocket.TaskWebSocketMessage;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public TaskService(
            TaskRepository taskRepository,
            UserRepository userRepository,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public List<Task> getTasks(String email) {
        User user = getUser(email);
        return taskRepository.findByUser(user);
    }

    public Task getTask(Long id, String email) {
        User user = getUser(email);

        return taskRepository.findById(id)
                .filter(task ->
                        task.getUser()
                                .getId()
                                .equals(user.getId())
                )
                .orElseThrow(
                        () -> new RuntimeException("Task not found")
                );
    }

    public Task createTask(Task task, String email) {
        User user = getUser(email);

        task.setId(null);
        task.setUser(user);

        if (task.getStatus() == null ||
                task.getStatus().isBlank()) {
            task.setStatus("PENDING");
        }

        if (task.getPriority() == null ||
                task.getPriority().isBlank()) {
            task.setPriority("MEDIUM");
        }

        LocalDateTime now = LocalDateTime.now();

        task.setCreatedAt(now);
        task.setUpdatedAt(now);

        Task savedTask = taskRepository.save(task);

        messagingTemplate.convertAndSend(
                "/topic/tasks",
                new TaskWebSocketMessage(
                        "CREATED",
                        savedTask.getId(),
                        "New task created"
                )
        );

        return savedTask;
    }

    public Task updateTask(
            Long id,
            Task updatedTask,
            String email
    ) {
        Task task = getTask(id, email);

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setStatus(updatedTask.getStatus());
        task.setPriority(updatedTask.getPriority());
        task.setDueDate(updatedTask.getDueDate());
        task.setUpdatedAt(LocalDateTime.now());

        Task savedTask = taskRepository.save(task);

        messagingTemplate.convertAndSend(
                "/topic/tasks",
                new TaskWebSocketMessage(
                        "UPDATED",
                        savedTask.getId(),
                        "Task updated"
                )
        );

        return savedTask;
    }

    public void deleteTask(Long id, String email) {
        Task task = getTask(id, email);

        taskRepository.delete(task);

        messagingTemplate.convertAndSend(
                "/topic/tasks",
                new TaskWebSocketMessage(
                        "DELETED",
                        id,
                        "Task deleted"
                )
        );
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );
    }
}