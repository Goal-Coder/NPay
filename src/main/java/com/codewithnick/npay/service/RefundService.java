package com.codewithnick.npay.service;

import com.codewithnick.npay.dto.RefundRequest;
import com.codewithnick.npay.entity.Payment;
import com.codewithnick.npay.entity.Refund;
import com.codewithnick.npay.repository.PaymentRepository;
import com.codewithnick.npay.repository.RefundRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RefundService {

    private final RefundRepository refundRepository;
    private final PaymentRepository paymentRepository;

    public RefundService(RefundRepository refundRepository, PaymentRepository paymentRepository) {
        this.refundRepository = refundRepository;
        this.paymentRepository = paymentRepository;
    }

    public Refund processRefund(RefundRequest request) {
        Payment payment = paymentRepository.findById(request.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!"SUCCESS".equalsIgnoreCase(payment.getStatus())) {
            throw new RuntimeException("Cannot refund a payment that is not SUCCESSful");
        }

        Refund refund = new Refund();
        refund.setRefundId("REF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        refund.setPaymentId(payment.getId());
        refund.setAmount(request.getAmount() != null ? request.getAmount() : payment.getAmount());
        refund.setReason(request.getReason());
        refund.setStatus("PENDING");
        refund.setCreatedAt(LocalDateTime.now());

        return refundRepository.save(refund);
    }

    public Refund approveRefund(Long id) {
        Refund refund = getRefund(id);
        if (!"PENDING".equalsIgnoreCase(refund.getStatus())) {
            throw new RuntimeException("Refund is not in PENDING state");
        }

        Payment payment = paymentRepository.findById(refund.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Associated payment not found"));

        payment.setStatus("REFUNDED");
        paymentRepository.save(payment);

        refund.setStatus("APPROVED");
        return refundRepository.save(refund);
    }

    public Refund rejectRefund(Long id) {
        Refund refund = getRefund(id);
        if (!"PENDING".equalsIgnoreCase(refund.getStatus())) {
            throw new RuntimeException("Refund is not in PENDING state");
        }

        refund.setStatus("REJECTED");
        return refundRepository.save(refund);
    }

    public List<Refund> getAllRefunds() {
        return refundRepository.findAll();
    }

    public Refund getRefund(Long id) {
        return refundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Refund not found"));
    }
}
