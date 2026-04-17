package com.vtm.character_sheet.service;

import com.vtm.character_sheet.entity.Character;
import com.vtm.character_sheet.repository.CharacterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CharacterService {

    private final CharacterRepository repository;

    public List<Character> findAll() { return repository.findAll(); }
    public List<Character> findByOwner(Long ownerId) { return repository.findByOwner_Id(ownerId); }
    public Optional<Character> findById(Long id) { return repository.findById(id); }
    public List<Character> findByName(String name) { return repository.findByNameContainingIgnoreCase(name); }
    public List<Character> findByClan(String clan) { return repository.findByClan(clan); }
    public Character save(Character character) { return repository.save(character); }

    @Transactional
    public void deleteById(Long id) {
        repository.findById(id).ifPresent(character -> {
            character.setChronicle(null);
            repository.save(character);
            repository.delete(character);
        });
    }
}
