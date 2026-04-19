package com.vtm.character_sheet.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vtm.character_sheet.entity.Flaw;
import com.vtm.character_sheet.entity.Merit;
import com.vtm.character_sheet.service.FlawService;
import com.vtm.character_sheet.service.MeritService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final MeritService meritService;
    private final FlawService flawService;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        if (meritService.count() == 0) {
            log.info("Loading base data from JSON...");
            InputStream is = new ClassPathResource("vampiro_merits_flaws_en.json").getInputStream();
            JsonNode root = objectMapper.readTree(is);

            List<Merit> merits = new ArrayList<>();
            for (JsonNode node : root.get("merits")) {
                Merit m = new Merit();
                m.setName(getText(node, "name"));
                m.setCost(getInt(node, "custo"));
                m.setCostObs(getText(node, "custo_obs"));
                m.setSource(getText(node, "fonte"));
                m.setPage(getInt(node, "pagina"));
                m.setDescription(getText(node, "descricao"));
                merits.add(m);
            }
            meritService.saveAll(merits);
            log.info("Loaded {} merits.", merits.size());

            List<Flaw> flaws = new ArrayList<>();
            for (JsonNode node : root.get("flaws")) {
                Flaw f = new Flaw();
                f.setName(getText(node, "name"));
                f.setBonus(getInt(node, "bonus"));
                f.setBonusObs(getText(node, "bonus_obs"));
                f.setSource(getText(node, "fonte"));
                f.setPage(getInt(node, "pagina"));
                f.setDescription(getText(node, "descricao"));
                flaws.add(f);
            }
            flawService.saveAll(flaws);
            log.info("Loaded {} flaws.", flaws.size());
        } else {
            log.info("Base data already present — skipping base load.");
        }

        // Always apply the patch (adds missing entries, skips existing ones by name)
        try {
            InputStream patch = new ClassPathResource("merits_flaws_patch.json").getInputStream();
            JsonNode patchRoot = objectMapper.readTree(patch);

            int addedMerits = 0;
            for (JsonNode node : patchRoot.get("merits")) {
                String name = getText(node, "name");
                if (name == null || meritService.existsByName(name)) continue;
                Merit m = new Merit();
                m.setName(name);
                m.setCost(getInt(node, "cost"));
                m.setCostObs(getText(node, "cost_obs"));
                m.setSource(getText(node, "source"));
                m.setPage(getInt(node, "page"));
                m.setDescription(getText(node, "description"));
                meritService.saveAll(List.of(m));
                addedMerits++;
            }

            int addedFlaws = 0;
            for (JsonNode node : patchRoot.get("flaws")) {
                String name = getText(node, "name");
                if (name == null || flawService.existsByName(name)) continue;
                Flaw f = new Flaw();
                f.setName(name);
                f.setBonus(getInt(node, "bonus"));
                f.setBonusObs(getText(node, "bonus_obs"));
                f.setSource(getText(node, "source"));
                f.setPage(getInt(node, "page"));
                f.setDescription(getText(node, "description"));
                flawService.saveAll(List.of(f));
                addedFlaws++;
            }

            log.info("Patch applied: +{} merits, +{} flaws.", addedMerits, addedFlaws);
        } catch (Exception e) {
            log.warn("No patch file found or patch failed: {}", e.getMessage());
        }

        // One-time migration: fix TBD merit names and remove duplicates
        try {
            List<Merit> allMerits = meritService.findAll();
            boolean hasTbd = allMerits.stream().anyMatch(m -> "TBD".equals(m.getName()));
            if (hasTbd) {
                log.info("Detected TBD merit names — rebuilding merit catalogue from corrected JSON...");
                // Delete all existing merits and reload from corrected JSON
                meritService.deleteAll();
                InputStream fixIs = new ClassPathResource("vampiro_merits_flaws_en.json").getInputStream();
                JsonNode fixRoot = objectMapper.readTree(fixIs);
                List<Merit> freshMerits = new ArrayList<>();
                for (JsonNode node : fixRoot.get("merits")) {
                    Merit m = new Merit();
                    m.setName(getText(node, "name"));
                    m.setCost(getInt(node, "custo"));
                    m.setCostObs(getText(node, "custo_obs"));
                    m.setSource(getText(node, "fonte"));
                    m.setPage(getInt(node, "pagina"));
                    m.setDescription(getText(node, "descricao"));
                    freshMerits.add(m);
                }
                meritService.saveAll(freshMerits);
                log.info("Rebuilt merit catalogue: {} merits loaded (TBDs named, duplicates removed).", freshMerits.size());
            }
        } catch (Exception e) {
            log.warn("Merit TBD migration failed: {}", e.getMessage());
        }

        // One-time migration: nuke and reload all flaws from corrected JSON
        // This fixes Portuguese flaw names that were loaded from the original data
        try {
            List<Flaw> allFlaws = flawService.findAll();
            boolean hasPt = allFlaws.stream().anyMatch(f ->
                f.getName() != null && f.getName().matches(".*[àáâãçéêíóôõúüÀÁÂÃÇÉÊÍÓÔÕÚÜ].*"));
            if (hasPt) {
                log.info("Detected Portuguese flaw names — rebuilding flaw catalogue from corrected JSON...");
                // Build a map of corrected names from JSON keyed by description (most unique field)
                InputStream fixIs = new ClassPathResource("vampiro_merits_flaws_en.json").getInputStream();
                JsonNode fixRoot = objectMapper.readTree(fixIs);
                // Create lookup: old description -> new name from JSON
                java.util.Map<String, String> descToName = new java.util.HashMap<>();
                for (JsonNode node : fixRoot.get("flaws")) {
                    String desc = getText(node, "descricao");
                    String name = getText(node, "name");
                    if (desc != null && name != null) descToName.put(desc, name);
                }
                int fixed = 0;
                for (Flaw f : allFlaws) {
                    if (f.getDescription() != null && descToName.containsKey(f.getDescription())) {
                        String newName = descToName.get(f.getDescription());
                        if (!newName.equals(f.getName())) {
                            f.setName(newName);
                            fixed++;
                        }
                    }
                    // Also extract English from "Portuguese (English)" pattern
                    if (f.getName() != null && f.getName().contains("(") && f.getName().contains(")")) {
                        String en = f.getName().replaceAll(".*\\(([^)]+)\\).*", "$1").trim();
                        if (!en.equals(f.getName())) {
                            f.setName(en);
                            fixed++;
                        }
                    }
                }
                if (fixed > 0) {
                    flawService.saveAll(allFlaws);
                    log.info("Fixed {} flaw names from Portuguese to English.", fixed);
                }
            }
        } catch (Exception e) {
            log.warn("Flaw name migration failed: {}", e.getMessage());
        }
    }

    private String getText(JsonNode node, String field) {
        JsonNode val = node.get(field);
        return (val != null && !val.isNull()) ? val.asText() : null;
    }

    private Integer getInt(JsonNode node, String field) {
        JsonNode val = node.get(field);
        return (val != null && !val.isNull()) ? val.asInt() : null;
    }
}