package com.taskmanager.backend.controller;

import com.taskmanager.backend.dto.LoginRequest;
import com.taskmanager.backend.dto.RegisterRequest;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        try {

            User user = authService.register(request);

            return ResponseEntity.ok(
                    Map.of(
                            "message", "User registered successfully",
                            "id", user.getId(),
                            "name", user.getName(),
                            "email", user.getEmail()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            return ResponseEntity.ok(
                    authService.login(request)
            );

        } catch (RuntimeException e) {

            return ResponseEntity.status(401).body(
                    Map.of("message", e.getMessage())
            );
        }
    }
}
