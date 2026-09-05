package com.codewithnick.npay.dto;

import java.time.LocalDateTime;

public class PaymentResponse {

    private Long id;
    private String transactionId;
    private String customerName;
    private String customerEmail;
    private Double amount;
    private String currency;
    private String paymentMethod;
    private String status;
    private LocalDateTime createdAt;

    public PaymentResponse() {
    }

    public PaymentResponse(Long id, String transactionId, String customerName, String customerEmail,
                           Double amount, String currency, String paymentMethod, String status, LocalDateTime createdAt) {
        this.id = id;
        this.transactionId = transactionId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.amount = amount;
        this.currency = currency;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
