package com.vtm.character_sheet.controller;

import com.vtm.character_sheet.entity.Merit;
import com.vtm.character_sheet.service.MeritService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/merits")
@RequiredArgsConstructor
public class MeritController {

    private final MeritService service;

    @GetMapping
    public List<Merit> findAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer cost,
            @RequestParam(required = false) Integer maxCost
    ) {
        if (name != null) return service.findByName(name);
        if (cost != null) return service.findByCost(cost);
        if (maxCost != null) return service.findByCostUpTo(maxCost);
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Merit> findById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}