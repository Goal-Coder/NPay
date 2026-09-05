package com.codewithnick.npay.service;


import com.codewithnick.npay.dto.PaymentRequest;
import com.codewithnick.npay.entity.Merchant;
import com.codewithnick.npay.entity.Payment;
import com.codewithnick.npay.repository.MerchantRepository;
import com.codewithnick.npay.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final MerchantRepository merchantRepository;

    public PaymentService(PaymentRepository paymentRepository, MerchantRepository merchantRepository) {
        this.paymentRepository = paymentRepository;
        this.merchantRepository = merchantRepository;
    }

    public Payment createPayment(PaymentRequest request) {

        Payment payment = new Payment();

        payment.setTransactionId(
                "TXN-" + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase()
        );

        payment.setCustomerName(request.getCustomerName());
        payment.setCustomerEmail(request.getCustomerEmail());
        payment.setAmount(request.getAmount());
        payment.setCurrency(request.getCurrency() != null && !request.getCurrency().isBlank() ? request.getCurrency() : "INR");
        payment.setPaymentMethod(request.getPaymentMethod() != null && !request.getPaymentMethod().isBlank() ? request.getPaymentMethod() : "UPI");

        String recipientName = request.getRecipientName();
        String recipientEmail = request.getRecipientEmail();
        Long merchantId = request.getMerchantId();

        if (merchantId != null) {
            Merchant merchant = merchantRepository.findById(merchantId).orElse(null);
            if (merchant != null) {
                if (recipientName == null || recipientName.isBlank()) {
                    recipientName = merchant.getBusinessName() != null ? merchant.getBusinessName() : merchant.getName();
                }
                if (recipientEmail == null || recipientEmail.isBlank()) {
                    recipientEmail = merchant.getEmail();
                }
            }
        }

        payment.setRecipientName(recipientName);
        payment.setRecipientEmail(recipientEmail);
        payment.setMerchantId(merchantId);

        /*
         * Mock payment logic.
         *
         * In a real payment gateway this would communicate
         * with a payment processor.
         */
        if (request.getAmount() != null && request.getAmount() > 0) {
            payment.setStatus("SUCCESS");
        } else {
            payment.setStatus("FAILED");
        }

        payment.setCreatedAt(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsForUser(String email, boolean isAdmin) {
        if (isAdmin) {
            return paymentRepository.findAll();
        }
        return paymentRepository.findByCustomerEmailOrRecipientEmail(email, email);
    }

    public Payment getPayment(Long id) {

        return paymentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));
    }
}