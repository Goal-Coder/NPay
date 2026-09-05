package com.codewithnick.npay.controller;

import com.codewithnick.npay.dto.RefundRequest;
import com.codewithnick.npay.entity.Refund;
import com.codewithnick.npay.service.RefundService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/refunds")
@CrossOrigin(origins = "*")
public class RefundController {

    private final RefundService refundService;

    public RefundController(RefundService refundService) {
        this.refundService = refundService;
    }

    @PostMapping
    public Refund processRefund(@RequestBody RefundRequest request) {
        return refundService.processRefund(request);
    }

    @GetMapping
    public List<Refund> getAllRefunds() {
        return refundService.getAllRefunds();
    }

    @GetMapping("/{id}")
    public Refund getRefund(@PathVariable Long id) {
        return refundService.getRefund(id);
    }

    @PutMapping("/{id}/approve")
    public Refund approveRefund(@PathVariable Long id) {
        return refundService.approveRefund(id);
    }

    @PutMapping("/{id}/reject")
    public Refund rejectRefund(@PathVariable Long id) {
        return refundService.rejectRefund(id);
    }
}
