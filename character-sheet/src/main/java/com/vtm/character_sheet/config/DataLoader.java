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