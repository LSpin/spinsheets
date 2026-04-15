package com.vtm.character_sheet.service;

import com.vtm.character_sheet.entity.Chronicle;
import com.vtm.character_sheet.repository.ChronicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChronicleService {

    private final ChronicleRepository repository;

    public List<Chronicle> findAll() { return repository.findAll(); }
    public List<Chronicle> findByStoryteller(Long storytellerId) { return repository.findByStoryteller_Id(storytellerId); }
    public Optional<Chronicle> findById(Long id) { return repository.findById(id); }
    public Chronicle save(Chronicle chronicle) { return repository.save(chronicle); }
    public void deleteById(Long id) { repository.deleteById(id); }
}
