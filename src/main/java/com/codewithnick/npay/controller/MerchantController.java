package com.codewithnick.npay.controller;

import com.codewithnick.npay.dto.MerchantRequest;
import com.codewithnick.npay.entity.Merchant;
import com.codewithnick.npay.service.MerchantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/merchants")
@CrossOrigin(origins = "*")
public class MerchantController {

    private final MerchantService merchantService;

    public MerchantController(MerchantService merchantService) {
        this.merchantService = merchantService;
    }

    @PostMapping
    public Merchant createMerchant(@RequestBody MerchantRequest request) {
        return merchantService.createMerchant(request);
    }

    @GetMapping
    public List<Merchant> getAllMerchants() {
        return merchantService.getAllMerchants();
    }

    @GetMapping("/{id}")
    public Merchant getMerchant(@PathVariable Long id) {
        return merchantService.getMerchant(id);
    }
}
