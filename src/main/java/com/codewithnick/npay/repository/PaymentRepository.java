package com.codewithnick.npay.repository;

import com.codewithnick.npay.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByCustomerEmailOrRecipientEmail(String customerEmail, String recipientEmail);
    List<Payment> findByCustomerEmail(String customerEmail);
}