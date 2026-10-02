package com.taskmanager.backend.websocket;

public class TaskWebSocketMessage {

    private String action;
    private Long taskId;
    private String message;

    public TaskWebSocketMessage() {
    }

    public TaskWebSocketMessage(
            String action,
            Long taskId,
            String message
    ) {
        this.action = action;
        this.taskId = taskId;
        this.message = message;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}