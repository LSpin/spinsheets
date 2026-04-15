package com.vtm.character_sheet.controller;

import com.vtm.character_sheet.entity.AppUser;
import com.vtm.character_sheet.entity.Character;
import com.vtm.character_sheet.entity.Chronicle;
import com.vtm.character_sheet.entity.Role;
import com.vtm.character_sheet.repository.CharacterRepository;
import com.vtm.character_sheet.security.CharacterAccessChecker;
import com.vtm.character_sheet.service.CharacterService;
import com.vtm.character_sheet.service.ChronicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
public class CharacterController {

    private final CharacterService service;
    private final ChronicleService chronicleService;
    private final CharacterRepository characterRepository;
    private final CharacterAccessChecker access;

    @GetMapping
    public List<Character> findAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String clan
    ) {
        AppUser user = access.getCurrentUser();
        if (user.getRole() == Role.STORYTELLER) {
            // Storytellers see their own characters + characters in their chronicles
            LinkedHashSet<Character> result = new LinkedHashSet<>(service.findByOwner(user.getId()));
            for (Chronicle c : chronicleService.findByStoryteller(user.getId())) {
                result.addAll(characterRepository.findByChronicle_Id(c.getId()));
            }
            return new ArrayList<>(result);
        }
        return service.findByOwner(user.getId());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Character> findById(@PathVariable Long id) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Character create(@Valid @RequestBody Character character) {
        character.setOwner(access.getCurrentUser());
        return service.save(character);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Character> update(@PathVariable Long id, @Valid @RequestBody Character updated) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return service.findById(id).map(existing -> {
            existing.setNpc(updated.getNpc());
            // Identity
            existing.setName(updated.getName());
            existing.setAltName(updated.getAltName());
            existing.setConcept(updated.getConcept());
            existing.setClan(updated.getClan());
            existing.setSect(updated.getSect());
            existing.setGeneration(updated.getGeneration());
            existing.setNature(updated.getNature());
            existing.setDemeanor(updated.getDemeanor());
            existing.setDomainHaven(updated.getDomainHaven());
            existing.setVisibleAge(updated.getVisibleAge());
            existing.setTotalAge(updated.getTotalAge());
            // Attributes
            existing.setStrength(updated.getStrength());
            existing.setDexterity(updated.getDexterity());
            existing.setStamina(updated.getStamina());
            existing.setCharisma(updated.getCharisma());
            existing.setManipulation(updated.getManipulation());
            existing.setAppearance(updated.getAppearance());
            existing.setPerception(updated.getPerception());
            existing.setIntelligence(updated.getIntelligence());
            existing.setWits(updated.getWits());
            // Talents
            existing.setAlertness(updated.getAlertness());
            existing.setAthletics(updated.getAthletics());
            existing.setAwareness(updated.getAwareness());
            existing.setBrawl(updated.getBrawl());
            existing.setEmpathy(updated.getEmpathy());
            existing.setExpression(updated.getExpression());
            existing.setIntimidation(updated.getIntimidation());
            existing.setLeadership(updated.getLeadership());
            existing.setStreetwise(updated.getStreetwise());
            existing.setSubterfuge(updated.getSubterfuge());
            existing.setDodge(updated.getDodge());
            existing.setHobbyTalent1Name(updated.getHobbyTalent1Name());
            existing.setHobbyTalent1(updated.getHobbyTalent1());
            existing.setHobbyTalent2Name(updated.getHobbyTalent2Name());
            existing.setHobbyTalent2(updated.getHobbyTalent2());
            existing.setHobbyTalent3Name(updated.getHobbyTalent3Name());
            existing.setHobbyTalent3(updated.getHobbyTalent3());
            // Skills
            existing.setAnimalKen(updated.getAnimalKen());
            existing.setCrafts(updated.getCrafts());
            existing.setDrive(updated.getDrive());
            existing.setEtiquette(updated.getEtiquette());
            existing.setFirearms(updated.getFirearms());
            existing.setLarceny(updated.getLarceny());
            existing.setMelee(updated.getMelee());
            existing.setPerformance(updated.getPerformance());
            existing.setSecurity(updated.getSecurity());
            existing.setStealth(updated.getStealth());
            existing.setSurvival(updated.getSurvival());
            existing.setProfSkill1Name(updated.getProfSkill1Name());
            existing.setProfSkill1(updated.getProfSkill1());
            existing.setProfSkill2Name(updated.getProfSkill2Name());
            existing.setProfSkill2(updated.getProfSkill2());
            existing.setProfSkill3Name(updated.getProfSkill3Name());
            existing.setProfSkill3(updated.getProfSkill3());
            // Knowledges
            existing.setAcademics(updated.getAcademics());
            existing.setComputer(updated.getComputer());
            existing.setFinance(updated.getFinance());
            existing.setInvestigation(updated.getInvestigation());
            existing.setLaw(updated.getLaw());
            existing.setLinguistics(updated.getLinguistics());
            existing.setMedicine(updated.getMedicine());
            existing.setOccult(updated.getOccult());
            existing.setPolitics(updated.getPolitics());
            existing.setScience(updated.getScience());
            existing.setTechnology(updated.getTechnology());
            existing.setExpertKnowl1Name(updated.getExpertKnowl1Name());
            existing.setExpertKnowl1(updated.getExpertKnowl1());
            existing.setExpertKnowl2Name(updated.getExpertKnowl2Name());
            existing.setExpertKnowl2(updated.getExpertKnowl2());
            existing.setExpertKnowl3Name(updated.getExpertKnowl3Name());
            existing.setExpertKnowl3(updated.getExpertKnowl3());
            // Specialties — Attributes
            existing.setStrengthSpec(updated.getStrengthSpec());
            existing.setDexteritySpec(updated.getDexteritySpec());
            existing.setStaminaSpec(updated.getStaminaSpec());
            existing.setCharismaSpec(updated.getCharismaSpec());
            existing.setManipulationSpec(updated.getManipulationSpec());
            existing.setAppearanceSpec(updated.getAppearanceSpec());
            existing.setPerceptionSpec(updated.getPerceptionSpec());
            existing.setIntelligenceSpec(updated.getIntelligenceSpec());
            existing.setWitsSpec(updated.getWitsSpec());
            // Specialties — Talents
            existing.setAlertnessSpec(updated.getAlertnessSpec());
            existing.setAthleticsSpec(updated.getAthleticsSpec());
            existing.setAwarenessSpec(updated.getAwarenessSpec());
            existing.setBrawlSpec(updated.getBrawlSpec());
            existing.setDodgeSpec(updated.getDodgeSpec());
            existing.setEmpathySpec(updated.getEmpathySpec());
            existing.setExpressionSpec(updated.getExpressionSpec());
            existing.setIntimidationSpec(updated.getIntimidationSpec());
            existing.setLeadershipSpec(updated.getLeadershipSpec());
            existing.setStreetwiseSpec(updated.getStreetwiseSpec());
            existing.setSubterfugeSpec(updated.getSubterfugeSpec());
            // Specialties — Skills
            existing.setAnimalKenSpec(updated.getAnimalKenSpec());
            existing.setCraftsSpec(updated.getCraftsSpec());
            existing.setDriveSpec(updated.getDriveSpec());
            existing.setEtiquetteSpec(updated.getEtiquetteSpec());
            existing.setFirearmsSpec(updated.getFirearmsSpec());
            existing.setLarcenySpec(updated.getLarcenySpec());
            existing.setMeleeSpec(updated.getMeleeSpec());
            existing.setPerformanceSpec(updated.getPerformanceSpec());
            existing.setSecuritySpec(updated.getSecuritySpec());
            existing.setStealthSpec(updated.getStealthSpec());
            existing.setSurvivalSpec(updated.getSurvivalSpec());
            // Specialties — Knowledges
            existing.setAcademicsSpec(updated.getAcademicsSpec());
            existing.setComputerSpec(updated.getComputerSpec());
            existing.setFinanceSpec(updated.getFinanceSpec());
            existing.setInvestigationSpec(updated.getInvestigationSpec());
            existing.setLawSpec(updated.getLawSpec());
            existing.setLinguisticsSpec(updated.getLinguisticsSpec());
            existing.setMedicineSpec(updated.getMedicineSpec());
            existing.setOccultSpec(updated.getOccultSpec());
            existing.setPoliticsSpec(updated.getPoliticsSpec());
            existing.setScienceSpec(updated.getScienceSpec());
            existing.setTechnologySpec(updated.getTechnologySpec());
            // Virtues
            existing.setConscience(updated.getConscience());
            existing.setSelfControl(updated.getSelfControl());
            existing.setCourage(updated.getCourage());
            // Path, Willpower, Blood, Health
            existing.setPathName(updated.getPathName());
            existing.setPathRating(updated.getPathRating());
            existing.setWillpower(updated.getWillpower());
            existing.setCurrentWillpower(updated.getCurrentWillpower());
            existing.setCurrentBlood(updated.getCurrentBlood());
            existing.setWoundLevel(updated.getWoundLevel());
            // W20 fields
            existing.setBreed(updated.getBreed());
            existing.setAuspice(updated.getAuspice());
            existing.setTribe(updated.getTribe());
            existing.setPackName(updated.getPackName());
            existing.setPackTotem(updated.getPackTotem());
            existing.setRank(updated.getRank());
            existing.setPrimalUrge(updated.getPrimalUrge());
            existing.setPrimalUrgeSpec(updated.getPrimalUrgeSpec());
            existing.setEnigmas(updated.getEnigmas());
            existing.setEnigmasSpec(updated.getEnigmasSpec());
            existing.setRitualAbility(updated.getRitualAbility());
            existing.setRitualAbilitySpec(updated.getRitualAbilitySpec());
            existing.setRage(updated.getRage());
            existing.setCurrentRage(updated.getCurrentRage());
            existing.setGnosis(updated.getGnosis());
            existing.setCurrentGnosis(updated.getCurrentGnosis());
            existing.setGlory(updated.getGlory());
            existing.setCurrentGlory(updated.getCurrentGlory());
            existing.setHonor(updated.getHonor());
            existing.setCurrentHonor(updated.getCurrentHonor());
            existing.setWisdomRenown(updated.getWisdomRenown());
            existing.setCurrentWisdomRenown(updated.getCurrentWisdomRenown());
            existing.setSeptName(updated.getSeptName());
            existing.setCaernLocation(updated.getCaernLocation());
            existing.setCaernType(updated.getCaernType());
            existing.setSeptTotem(updated.getSeptTotem());
            existing.setSeptLeader(updated.getSeptLeader());
            // M20 fields
            existing.setEssence(updated.getEssence());
            existing.setAffiliation(updated.getAffiliation());
            existing.setMageSection(updated.getMageSection());
            existing.setArt(updated.getArt());
            existing.setArtSpec(updated.getArtSpec());
            existing.setMartialArts(updated.getMartialArts());
            existing.setMartialArtsSpec(updated.getMartialArtsSpec());
            existing.setMeditation(updated.getMeditation());
            existing.setMeditationSpec(updated.getMeditationSpec());
            existing.setResearch(updated.getResearch());
            existing.setResearchSpec(updated.getResearchSpec());
            existing.setCosmology(updated.getCosmology());
            existing.setCosmologySpec(updated.getCosmologySpec());
            existing.setEsoterica(updated.getEsoterica());
            existing.setEsotericaSpec(updated.getEsotericaSpec());
            existing.setSphereCorrespondence(updated.getSphereCorrespondence());
            existing.setSphereEntropy(updated.getSphereEntropy());
            existing.setSphereForces(updated.getSphereForces());
            existing.setSphereLife(updated.getSphereLife());
            existing.setSphereMatter(updated.getSphereMatter());
            existing.setSphereMind(updated.getSphereMind());
            existing.setSpherePrime(updated.getSpherePrime());
            existing.setSphereSpirit(updated.getSphereSpirit());
            existing.setSphereTime(updated.getSphereTime());
            existing.setArete(updated.getArete());
            existing.setQuintessence(updated.getQuintessence());
            existing.setParadox(updated.getParadox());
            existing.setParadigm(updated.getParadigm());
            existing.setPractice(updated.getPractice());
            existing.setInstruments(updated.getInstruments());
            existing.setChantryName(updated.getChantryName());
            existing.setChantryDescription(updated.getChantryDescription());
            // KotE fields
            existing.setPoNature(updated.getPoNature());
            existing.setBalance(updated.getBalance());
            existing.setDirection(updated.getDirection());
            existing.setWu(updated.getWu());
            existing.setDharmaName(updated.getDharmaName());
            existing.setDharmaRating(updated.getDharmaRating());
            existing.setHun(updated.getHun());
            existing.setPo(updated.getPo());
            existing.setYinChi(updated.getYinChi());
            existing.setYangChi(updated.getYangChi());
            existing.setDemonChi(updated.getDemonChi());
            existing.setImbalance(updated.getImbalance());
            // Derangements & Notes
            existing.setDerangement1(updated.getDerangement1());
            existing.setDerangement2(updated.getDerangement2());
            existing.setClanCurse(updated.getClanCurse());
            existing.setNotes(updated.getNotes());
            return ResponseEntity.ok(service.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        if (service.findById(id).isEmpty()) return ResponseEntity.notFound().build();
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/chronicle/{chronicleId}")
    public ResponseEntity<Character> joinChronicle(@PathVariable Long id, @PathVariable Long chronicleId) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return service.findById(id).map(character ->
            chronicleService.findById(chronicleId).map(chronicle -> {
                character.setChronicle(chronicle);
                return ResponseEntity.ok(service.save(character));
            }).orElse(ResponseEntity.notFound().build())
        ).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/chronicle")
    public ResponseEntity<Character> leaveChronicle(@PathVariable Long id) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return service.findById(id).map(character -> {
            character.setChronicle(null);
            return ResponseEntity.ok(service.save(character));
        }).orElse(ResponseEntity.notFound().build());
    }
}
