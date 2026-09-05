package com.codewithnick.npay.repository;

import com.codewithnick.npay.entity.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MerchantRepository extends JpaRepository<Merchant, Long> {
    boolean existsByEmail(String email);
    Optional<Merchant> findByEmail(String email);
}
