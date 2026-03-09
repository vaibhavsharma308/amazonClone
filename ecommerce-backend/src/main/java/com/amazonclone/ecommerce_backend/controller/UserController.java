package com.amazonclone.ecommerce_backend.controller;

import com.amazonclone.ecommerce_backend.model.User;
import com.amazonclone.ecommerce_backend.repository.UserRepository;
import com.amazonclone.ecommerce_backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // DTO for login request
    static class LoginRequest {
        public String email;
        public String password;
    }

    // Register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Email already registered");
            return ResponseEntity.badRequest().body(error);
        }

        User savedUser = userRepository.save(user);

        // Send welcome email
        emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getName());

        // Don't return the password
        Map<String, Object> response = new HashMap<>();
        response.put("id", savedUser.getId());
        response.put("name", savedUser.getName());
        response.put("email", savedUser.getEmail());
        response.put("message", "Account created successfully");
        return ResponseEntity.ok(response);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        return userRepository.findByEmail(loginRequest.email)
                .map(user -> {
                    if (user.getPassword().equals(loginRequest.password)) {
                        Map<String, Object> response = new HashMap<>();
                        response.put("id", user.getId());
                        response.put("name", user.getName());
                        response.put("email", user.getEmail());
                        response.put("phone", user.getPhone());
                        response.put("address", user.getAddress());
                        response.put("city", user.getCity());
                        response.put("zipCode", user.getZipCode());
                        response.put("message", "Login successful");
                        return ResponseEntity.ok(response);
                    }
                    Map<String, String> error = new HashMap<>();
                    error.put("message", "Invalid password");
                    return ResponseEntity.badRequest().body((Object) error);
                })
                .orElseGet(() -> {
                    Map<String, String> error = new HashMap<>();
                    error.put("message", "Email not found");
                    return ResponseEntity.badRequest().body(error);
                });
    }

    // Get profile
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    Map<String, Object> profile = new HashMap<>();
                    profile.put("id", user.getId());
                    profile.put("name", user.getName());
                    profile.put("email", user.getEmail());
                    profile.put("phone", user.getPhone());
                    profile.put("address", user.getAddress());
                    profile.put("city", user.getCity());
                    profile.put("zipCode", user.getZipCode());
                    profile.put("createdAt", user.getCreatedAt());
                    return ResponseEntity.ok(profile);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Update profile
    @PutMapping("/user/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody User updates) {
        return userRepository.findById(id)
                .map(user -> {
                    if (updates.getName() != null)
                        user.setName(updates.getName());
                    if (updates.getPhone() != null)
                        user.setPhone(updates.getPhone());
                    if (updates.getAddress() != null)
                        user.setAddress(updates.getAddress());
                    if (updates.getCity() != null)
                        user.setCity(updates.getCity());
                    if (updates.getZipCode() != null)
                        user.setZipCode(updates.getZipCode());
                    if (updates.getPassword() != null && !updates.getPassword().isEmpty()) {
                        user.setPassword(updates.getPassword());
                    }
                    User saved = userRepository.save(user);

                    Map<String, Object> response = new HashMap<>();
                    response.put("id", saved.getId());
                    response.put("name", saved.getName());
                    response.put("email", saved.getEmail());
                    response.put("phone", saved.getPhone());
                    response.put("address", saved.getAddress());
                    response.put("city", saved.getCity());
                    response.put("zipCode", saved.getZipCode());
                    response.put("message", "Profile updated successfully");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
