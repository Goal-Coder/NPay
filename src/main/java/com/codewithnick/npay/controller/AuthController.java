package com.codewithnick.npay.controller;




import com.codewithnick.npay.dto.LoginRequest;
import com.codewithnick.npay.dto.LoginResponse;
import com.codewithnick.npay.dto.RegisterRequest;
import com.codewithnick.npay.entity.User;
import com.codewithnick.npay.service.AuthService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // REGISTER
    @PostMapping("/register")
    public User register(
            @RequestBody RegisterRequest request) {

        return authService.register(request);
    }

    // LOGIN
    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }
}
