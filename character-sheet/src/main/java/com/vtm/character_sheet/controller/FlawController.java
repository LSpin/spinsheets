package com.vtm.character_sheet.controller;

import com.vtm.character_sheet.entity.Flaw;
import com.vtm.character_sheet.service.FlawService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flaws")
@RequiredArgsConstructor
public class FlawController {

    private final FlawService service;

    @GetMapping
    public List<Flaw> findAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer bonus
    ) {
        if (name != null) return service.findByName(name);
        if (bonus != null) return service.findByBonus(bonus);
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Flaw> findById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}