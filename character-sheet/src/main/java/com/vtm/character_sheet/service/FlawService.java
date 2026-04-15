package com.vtm.character_sheet.service;

import com.vtm.character_sheet.entity.Flaw;
import com.vtm.character_sheet.repository.FlawRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FlawService {

    private final FlawRepository repository;

    public List<Flaw> findAll() { return repository.findAll(); }
    public Optional<Flaw> findById(Long id) { return repository.findById(id); }
    public List<Flaw> findByName(String name) { return repository.findByNameContainingIgnoreCase(name); }
    public List<Flaw> findByBonus(Integer bonus) { return repository.findByBonus(bonus); }
    public void saveAll(List<Flaw> flaws) { repository.saveAll(flaws); }
    public long count() { return repository.count(); }
    public boolean existsByName(String name) { return repository.existsByNameIgnoreCase(name); }
}