package com.codewithnick.npay.service;




import com.codewithnick.npay.dto.LoginRequest;
import com.codewithnick.npay.dto.LoginResponse;
import com.codewithnick.npay.dto.RegisterRequest;
import com.codewithnick.npay.entity.User;
import com.codewithnick.npay.repository.UserRepository;
import com.codewithnick.npay.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(
                request.getEmail())) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        if (request.getRole() == null ||
                request.getRole().isBlank()) {

            user.setRole("CUSTOMER");

        } else {

            user.setRole(
                    request.getRole().toUpperCase()
            );
        }

        return userRepository.save(user);
    }

    public LoginResponse login(
            LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        org.springframework.security.core.userdetails.User
                userDetails =
                (org.springframework.security.core.userdetails.User)
                        org.springframework.security.core.userdetails.User
                                .withUsername(user.getEmail())
                                .password(user.getPassword())
                                .roles(user.getRole())
                                .build();

        String token =
                jwtService.generateToken(userDetails);

        return new LoginResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
