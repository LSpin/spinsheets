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

        // One-time migration: translate Portuguese flaw names to English
        try {
            List<Flaw> allFlaws = flawService.findAll();
            java.util.Map<String, String> ptToEn = java.util.Map.ofEntries(
                java.util.Map.entry("14ª Geração", "14th Generation"),
                java.util.Map.entry("Aleijado", "Lame"),
                java.util.Map.entry("Amaldiçoado", "Cursed"),
                java.util.Map.entry("Aminésia", "Amnesia"),
                java.util.Map.entry("Analfabeto", "Illiterate"),
                java.util.Map.entry("Aperto dos Amaldiçoados", "Grip of the Damned"),
                java.util.Map.entry("Assombrado", "Haunted"),
                java.util.Map.entry("Bairrismo", "Parochialism"),
                java.util.Map.entry("Cabeça Quente", "Hot-Headed"),
                java.util.Map.entry("Caçado", "Hunted"),
                java.util.Map.entry("Caolho", "One Eye"),
                java.util.Map.entry("Cegueira", "Blind"),
                java.util.Map.entry("Confuso", "Confused"),
                java.util.Map.entry("Contagioso", "Contagious"),
                java.util.Map.entry("Deformidade", "Deformity"),
                java.util.Map.entry("Desfigurado", "Disfigured"),
                java.util.Map.entry("Disléxico", "Dyslexic"),
                java.util.Map.entry("Laçado", "Bound"),
                java.util.Map.entry("Necrófilo", "Necrophile"),
                java.util.Map.entry("Preguiçoso", "Lazy"),
                java.util.Map.entry("Putrescência", "Putrescence"),
                java.util.Map.entry("Um Braço", "One Arm"),
                java.util.Map.entry("Vingança", "Vengeance"),
                java.util.Map.entry("Estigmata", "Stigmata"),
                java.util.Map.entry("Infecsioso", "Infectious"),
                java.util.Map.entry("Coração Mole", "Soft-Hearted"),
                java.util.Map.entry("Coração Perdido", "Lost Heart"),
                java.util.Map.entry("Dentes Rombudos", "Blunt Fangs"),
                java.util.Map.entry("Cheiro de Tumulo", "Smell of the Grave"),
                java.util.Map.entry("Cura Demorada", "Slow Healing"),
                java.util.Map.entry("Besta Suicida", "Suicidal Beast"),
                java.util.Map.entry("Consumo Conspícuo", "Conspicuous Consumption")
            );
            int renamed = 0;
            for (Flaw f : allFlaws) {
                // Direct match
                if (ptToEn.containsKey(f.getName())) {
                    f.setName(ptToEn.get(f.getName()));
                    renamed++;
                }
                // Extract English from parentheses pattern "Portuguese (English)"
                else if (f.getName().contains("(") && f.getName().contains(")")) {
                    String en = f.getName().replaceAll(".*\\(([^)]+)\\).*", "$1").trim();
                    if (!en.equals(f.getName())) {
                        f.setName(en);
                        renamed++;
                    }
                }
            }
            if (renamed > 0) {
                flawService.saveAll(allFlaws);
                log.info("Migrated {} flaw names from Portuguese to English.", renamed);
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