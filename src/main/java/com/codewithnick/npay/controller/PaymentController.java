package com.codewithnick.npay.controller;


import com.codewithnick.npay.dto.PaymentRequest;
import com.codewithnick.npay.entity.Payment;
import com.codewithnick.npay.service.PaymentService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public Payment createPayment(
            @RequestBody PaymentRequest request) {

        return paymentService.createPayment(request);
    }

    @GetMapping
    public List<Payment> getAllPayments(Authentication authentication) {
        if (authentication == null) {
            return paymentService.getAllPayments();
        }
        String email = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return paymentService.getPaymentsForUser(email, isAdmin);
    }

    @GetMapping("/{id}")
    public Payment getPayment(@PathVariable Long id) {

        return paymentService.getPayment(id);
    }
}