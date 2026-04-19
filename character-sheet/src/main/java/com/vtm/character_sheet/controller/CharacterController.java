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

import java.util.*;

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
            // 7th Sea fields
            existing.setTraitBrawn(updated.getTraitBrawn());
            existing.setTraitFinesse(updated.getTraitFinesse());
            existing.setTraitResolve(updated.getTraitResolve());
            existing.setTraitWits7s(updated.getTraitWits7s());
            existing.setTraitPanache(updated.getTraitPanache());
            existing.setSkillAim(updated.getSkillAim());
            existing.setSkillAthletics7s(updated.getSkillAthletics7s());
            existing.setSkillBrawl7s(updated.getSkillBrawl7s());
            existing.setSkillConvince(updated.getSkillConvince());
            existing.setSkillEmpathy7s(updated.getSkillEmpathy7s());
            existing.setSkillHide(updated.getSkillHide());
            existing.setSkillIntimidate7s(updated.getSkillIntimidate7s());
            existing.setSkillNotice(updated.getSkillNotice());
            existing.setSkillPerform7s(updated.getSkillPerform7s());
            existing.setSkillRide7s(updated.getSkillRide7s());
            existing.setSkillSailing(updated.getSkillSailing());
            existing.setSkillScholarship(updated.getSkillScholarship());
            existing.setSkillTempt(updated.getSkillTempt());
            existing.setSkillTheft(updated.getSkillTheft());
            existing.setSkillWarfare(updated.getSkillWarfare());
            existing.setSkillWeaponry(updated.getSkillWeaponry());
            existing.setHeroVirtue(updated.getHeroVirtue());
            existing.setHeroHubris(updated.getHeroHubris());
            existing.setNation(updated.getNation());
            existing.setReligion(updated.getReligion());
            existing.setSorceryDesc(updated.getSorceryDesc());
            existing.setHeroPoints(updated.getHeroPoints());
            existing.setWealth7s(updated.getWealth7s());
            existing.setCorruption(updated.getCorruption());
            existing.setDramaticWounds(updated.getDramaticWounds());
            existing.setHeroStories(updated.getHeroStories());
            existing.setShipData7s(updated.getShipData7s());
            // L5R fields
            existing.setL5rReflexes(updated.getL5rReflexes());
            existing.setL5rAwareness(updated.getL5rAwareness());
            existing.setL5rStamina7(updated.getL5rStamina7());
            existing.setL5rWillpower7(updated.getL5rWillpower7());
            existing.setL5rAgility(updated.getL5rAgility());
            existing.setL5rIntelligence7(updated.getL5rIntelligence7());
            existing.setL5rStrength7(updated.getL5rStrength7());
            existing.setL5rPerception7(updated.getL5rPerception7());
            existing.setL5rVoid(updated.getL5rVoid());
            existing.setL5rCurrentVoid(updated.getL5rCurrentVoid());
            existing.setL5rHonor(updated.getL5rHonor());
            existing.setL5rGlory(updated.getL5rGlory());
            existing.setL5rStatus(updated.getL5rStatus());
            existing.setL5rInsight(updated.getL5rInsight());
            existing.setL5rSchoolRank(updated.getL5rSchoolRank());
            existing.setL5rWounds(updated.getL5rWounds());
            existing.setL5rClan(updated.getL5rClan());
            existing.setL5rFamily(updated.getL5rFamily());
            existing.setL5rSchool(updated.getL5rSchool());
            existing.setL5rTechniques(updated.getL5rTechniques());
            existing.setL5rInitiative(updated.getL5rInitiative());
            existing.setL5rArmorTN(updated.getL5rArmorTN());
            existing.setL5rSkillsText(updated.getL5rSkillsText());
            existing.setL5rSpells(updated.getL5rSpells());
            existing.setL5rKata(updated.getL5rKata());
            // Derangements & Notes
            existing.setDerangement1(updated.getDerangement1());
            existing.setDerangement2(updated.getDerangement2());
            existing.setClanCurse(updated.getClanCurse());
            existing.setNotes(updated.getNotes());
            existing.setBackstory(updated.getBackstory());
            existing.setAppearanceDesc(updated.getAppearanceDesc());
            existing.setGoals(updated.getGoals());
            existing.setAllies(updated.getAllies());
            existing.setEnemies(updated.getEnemies());
            existing.setHavens(updated.getHavens());
            existing.setTerritories(updated.getTerritories());
            existing.setPersonalItems(updated.getPersonalItems());
            // Blades in the Dark
            existing.setBladesAlias(updated.getBladesAlias());
            existing.setBladesHeritage(updated.getBladesHeritage());
            existing.setBladesBackground(updated.getBladesBackground());
            existing.setBladesVice(updated.getBladesVice());
            existing.setBladesVicePurveyor(updated.getBladesVicePurveyor());
            existing.setBladesPlaybook(updated.getBladesPlaybook());
            existing.setBladesHunt(updated.getBladesHunt());
            existing.setBladesStudy(updated.getBladesStudy());
            existing.setBladesSurvey(updated.getBladesSurvey());
            existing.setBladesTinker(updated.getBladesTinker());
            existing.setBladesFinesse(updated.getBladesFinesse());
            existing.setBladesProwl(updated.getBladesProwl());
            existing.setBladesSkirmish(updated.getBladesSkirmish());
            existing.setBladesWreck(updated.getBladesWreck());
            existing.setBladesAttune(updated.getBladesAttune());
            existing.setBladesCommand(updated.getBladesCommand());
            existing.setBladesConsort(updated.getBladesConsort());
            existing.setBladesSway(updated.getBladesSway());
            existing.setBladesStress(updated.getBladesStress());
            existing.setBladesTrauma(updated.getBladesTrauma());
            existing.setBladesHarm3(updated.getBladesHarm3());
            existing.setBladesHarm2a(updated.getBladesHarm2a());
            existing.setBladesHarm2b(updated.getBladesHarm2b());
            existing.setBladesHarm1a(updated.getBladesHarm1a());
            existing.setBladesHarm1b(updated.getBladesHarm1b());
            existing.setBladesHealingClock(updated.getBladesHealingClock());
            existing.setBladesArmor(updated.getBladesArmor());
            existing.setBladesHeavyArmor(updated.getBladesHeavyArmor());
            existing.setBladesSpecialArmor(updated.getBladesSpecialArmor());
            existing.setBladesLoad(updated.getBladesLoad());
            existing.setBladesItems(updated.getBladesItems());
            existing.setBladesAbilities(updated.getBladesAbilities());
            existing.setBladesStash(updated.getBladesStash());
            existing.setBladesLifestyle(updated.getBladesLifestyle());
            existing.setBladesDebt(updated.getBladesDebt());
            existing.setBladesEdge(updated.getBladesEdge());
            existing.setBladesInsightXp(updated.getBladesInsightXp());
            existing.setBladesProwessXp(updated.getBladesProwessXp());
            existing.setBladesResolveXp(updated.getBladesResolveXp());
            existing.setBladesPlaybookXp(updated.getBladesPlaybookXp());
            existing.setBladesContacts(updated.getBladesContacts());
            // Blades Crew
            existing.setBladesCrewType(updated.getBladesCrewType());
            existing.setBladesReputation(updated.getBladesReputation());
            existing.setBladesTier(updated.getBladesTier());
            existing.setBladesHold(updated.getBladesHold());
            existing.setBladesHeat(updated.getBladesHeat());
            existing.setBladesWanted(updated.getBladesWanted());
            existing.setBladesCoin(updated.getBladesCoin());
            existing.setBladesVault(updated.getBladesVault());
            existing.setBladesCrewAbilities(updated.getBladesCrewAbilities());
            existing.setBladesCrewUpgrades(updated.getBladesCrewUpgrades());
            existing.setBladesHuntingGrounds(updated.getBladesHuntingGrounds());
            existing.setBladesCrewContacts(updated.getBladesCrewContacts());
            existing.setBladesCohorts(updated.getBladesCohorts());
            existing.setBladesCrewXp(updated.getBladesCrewXp());
            // D&D 5e
            existing.setDndRace(updated.getDndRace());
            existing.setDndSubrace(updated.getDndSubrace());
            existing.setDndClass(updated.getDndClass());
            existing.setDndSubclass(updated.getDndSubclass());
            existing.setDndLevel(updated.getDndLevel());
            existing.setDndBackground(updated.getDndBackground());
            existing.setDndAlignment(updated.getDndAlignment());
            existing.setDndXp(updated.getDndXp());
            existing.setDndStrength(updated.getDndStrength());
            existing.setDndDexterity(updated.getDndDexterity());
            existing.setDndConstitution(updated.getDndConstitution());
            existing.setDndIntelligence(updated.getDndIntelligence());
            existing.setDndWisdom(updated.getDndWisdom());
            existing.setDndCharisma(updated.getDndCharisma());
            existing.setDndHpMax(updated.getDndHpMax());
            existing.setDndHpCurrent(updated.getDndHpCurrent());
            existing.setDndHpTemp(updated.getDndHpTemp());
            existing.setDndArmorClass(updated.getDndArmorClass());
            existing.setDndSpeed(updated.getDndSpeed());
            existing.setDndInitiativeBonus(updated.getDndInitiativeBonus());
            existing.setDndHitDiceRemaining(updated.getDndHitDiceRemaining());
            existing.setDndDeathSaveSuccesses(updated.getDndDeathSaveSuccesses());
            existing.setDndDeathSaveFailures(updated.getDndDeathSaveFailures());
            existing.setDndInspiration(updated.getDndInspiration());
            existing.setDndSkillProficiencies(updated.getDndSkillProficiencies());
            existing.setDndSkillExpertise(updated.getDndSkillExpertise());
            existing.setDndSavingThrows(updated.getDndSavingThrows());
            existing.setDndArmorProf(updated.getDndArmorProf());
            existing.setDndWeaponProf(updated.getDndWeaponProf());
            existing.setDndToolProf(updated.getDndToolProf());
            existing.setDndLanguages(updated.getDndLanguages());
            existing.setDndSpellcastingAbility(updated.getDndSpellcastingAbility());
            existing.setDndSpellSlots(updated.getDndSpellSlots());
            existing.setDndSpellsKnown(updated.getDndSpellsKnown());
            existing.setDndSpellsPrepared(updated.getDndSpellsPrepared());
            existing.setDndClassFeatures(updated.getDndClassFeatures());
            existing.setDndRacialTraits(updated.getDndRacialTraits());
            existing.setDndFeats(updated.getDndFeats());
            existing.setDndCp(updated.getDndCp());
            existing.setDndSp(updated.getDndSp());
            existing.setDndEp(updated.getDndEp());
            existing.setDndGp(updated.getDndGp());
            existing.setDndPp(updated.getDndPp());
            existing.setDndPersonalityTraits(updated.getDndPersonalityTraits());
            existing.setDndIdeals(updated.getDndIdeals());
            existing.setDndBonds(updated.getDndBonds());
            existing.setDndFlaws(updated.getDndFlaws());
            // D&D Monster
            existing.setDndMonsterType(updated.getDndMonsterType());
            existing.setDndMonsterSize(updated.getDndMonsterSize());
            existing.setDndChallengeRating(updated.getDndChallengeRating());
            existing.setDndMonsterAC(updated.getDndMonsterAC());
            existing.setDndMonsterHP(updated.getDndMonsterHP());
            existing.setDndMonsterSpeed(updated.getDndMonsterSpeed());
            existing.setDndMonsterActions(updated.getDndMonsterActions());
            existing.setDndMonsterTraits(updated.getDndMonsterTraits());
            existing.setDndMonsterLegendary(updated.getDndMonsterLegendary());
            existing.setDndLairActions(updated.getDndLairActions());
            existing.setDndMonsterImmunities(updated.getDndMonsterImmunities());
            existing.setDndMonsterResistances(updated.getDndMonsterResistances());
            existing.setDndMonsterVulnerabilities(updated.getDndMonsterVulnerabilities());
            existing.setDndMonsterSenses(updated.getDndMonsterSenses());
            existing.setDndMonsterLanguages(updated.getDndMonsterLanguages());
            // UESTRPG
            existing.setUestrpgBirthsign(updated.getUestrpgBirthsign());
            existing.setUestrpgMagickaMax(updated.getUestrpgMagickaMax());
            existing.setUestrpgMagickaCurrent(updated.getUestrpgMagickaCurrent());
            existing.setUestrpgLuck(updated.getUestrpgLuck());
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

    private static final Map<String, String> SPLAT_CATEGORY = Map.ofEntries(
        Map.entry("VAMPIRE", "VAMPIRE"), Map.entry("VAMPIRE_REVISED", "VAMPIRE"),
        Map.entry("VAMPIRE_DARK_AGES", "VAMPIRE"), Map.entry("VICTORIAN_VAMPIRE", "VAMPIRE"),
        Map.entry("KOTE", "VAMPIRE"), Map.entry("GHOUL", "VAMPIRE"),
        Map.entry("WEREWOLF", "WEREWOLF"), Map.entry("WYLD_WEST_WEREWOLF", "WEREWOLF"),
        Map.entry("CHANGING_BREEDS", "WEREWOLF"), Map.entry("TOTEM", "WEREWOLF"), Map.entry("KINFOLK", "WEREWOLF"),
        Map.entry("MAGE", "MAGE"), Map.entry("VICTORIAN_MAGE", "MAGE"),
        Map.entry("FAMILIAR", "MAGE"),
        Map.entry("SEVENTH_SEA", "SEVENTH_SEA"),
        Map.entry("L5R", "L5R"),
        Map.entry("BLADES", "BLADES"), Map.entry("BLADES_CREW", "BLADES"),
        Map.entry("DND", "DND"), Map.entry("DND_MONSTER", "DND"),
        Map.entry("UESTRPG", "UESTRPG"), Map.entry("UESTRPG_ANTAGONIST", "UESTRPG"),
        Map.entry("L5R_ANTAGONIST", "L5R"), Map.entry("BLADES_ANTAGONIST", "BLADES"),
        Map.entry("HUNTER", "VAMPIRE"), Map.entry("WRAITH", "VAMPIRE"),
        Map.entry("CHANGELING", "MAGE"), Map.entry("DEMON", "VAMPIRE"),
        Map.entry("BSD", "WEREWOLF"), Map.entry("MORTAL", "VAMPIRE")
    );

    private boolean isSplatAllowed(Chronicle chronicle, String splat) {
        String allowed = chronicle.getAllowedSplats();
        if (allowed == null || allowed.isBlank()) return true;
        String category = SPLAT_CATEGORY.getOrDefault(splat, splat);
        return Arrays.asList(allowed.split(",")).contains(category);
    }

    @PutMapping("/{id}/chronicle/{chronicleId}")
    public ResponseEntity<?> joinChronicle(@PathVariable Long id, @PathVariable Long chronicleId) {
        if (!access.canAccess(id)) return ResponseEntity.status(403).build();
        return service.findById(id).map(character ->
            chronicleService.findById(chronicleId).map(chronicle -> {
                if (!isSplatAllowed(chronicle, character.getSplat())) {
                    return ResponseEntity.badRequest().body((Object) Map.of("error", "This character type is not allowed in this chronicle"));
                }
                character.setChronicle(chronicle);
                return ResponseEntity.ok((Object) service.save(character));
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
