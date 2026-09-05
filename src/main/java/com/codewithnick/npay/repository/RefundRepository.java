package com.codewithnick.npay.repository;

import com.codewithnick.npay.entity.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {
    List<Refund> findByPaymentId(Long paymentId);
}
