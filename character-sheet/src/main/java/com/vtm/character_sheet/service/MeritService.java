package com.vtm.character_sheet.service;

import com.vtm.character_sheet.entity.Merit;
import com.vtm.character_sheet.repository.MeritRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MeritService {

    private final MeritRepository repository;

    public List<Merit> findAll() { return repository.findAll(); }
    public Optional<Merit> findById(Long id) { return repository.findById(id); }
    public List<Merit> findByName(String name) { return repository.findByNameContainingIgnoreCase(name); }
    public List<Merit> findByCost(Integer cost) { return repository.findByCost(cost); }
    public List<Merit> findByCostUpTo(Integer max) { return repository.findByCostLessThanEqual(max); }
    public void saveAll(List<Merit> merits) { repository.saveAll(merits); }
    public long count() { return repository.count(); }
    public boolean existsByName(String name) { return repository.existsByNameIgnoreCase(name); }
}