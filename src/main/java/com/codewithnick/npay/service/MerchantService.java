package com.codewithnick.npay.service;

import com.codewithnick.npay.dto.MerchantRequest;
import com.codewithnick.npay.entity.Merchant;
import com.codewithnick.npay.repository.MerchantRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class MerchantService {

    private final MerchantRepository merchantRepository;

    public MerchantService(MerchantRepository merchantRepository) {
        this.merchantRepository = merchantRepository;
    }

    public Merchant createMerchant(MerchantRequest request) {
        if (merchantRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Merchant email already registered");
        }

        Merchant merchant = new Merchant();
        merchant.setName(request.getName());
        merchant.setEmail(request.getEmail());
        merchant.setBusinessName(request.getBusinessName());
        merchant.setApiKey("KEY-" + UUID.randomUUID().toString().replaceAll("-", "").substring(0, 16).toUpperCase());
        merchant.setStatus("ACTIVE");
        merchant.setCreatedAt(LocalDateTime.now());

        return merchantRepository.save(merchant);
    }

    public List<Merchant> getAllMerchants() {
        return merchantRepository.findAll();
    }

    public Merchant getMerchant(Long id) {
        return merchantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Merchant not found"));
    }
}
