# Spin's Sheets — Documento de Design

## Visão Geral

Spin's Sheets é um gerenciador de fichas de personagem para RPG de mesa baseado na web, suportando 8 sistemas de jogo com 33 formulários de personagem, mais de 350 templates de NPCs, gerenciamento de crônicas e roladores de dados integrados. A aplicação é totalmente bilíngue (Inglês / Português) e projetada para uso em desktop e dispositivos móveis.

**URL ao vivo:** https://spinsheets.com

---

## Pilha Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|---------|
| Frontend | React | 19 |
| Build | Vite | Última |
| Roteamento | React Router | v7 |
| Backend | Spring Boot | 3.5 |
| Linguagem | Java | 21 |
| Banco de Dados | PostgreSQL | Última |
| Autenticação | JWT + BCrypt | Customizado |
| Hospedagem | AWS EC2 | Ubuntu |
| Proxy Reverso | Caddy | Última |
| CI/CD | GitHub Actions | Push para main |
| TLS | Caddy auto-HTTPS | Let's Encrypt |

---

## Arquitetura

```
Browser
  │
  ├── React SPA (Vite build → /assets/*.js)
  │     ├── React Router v7 (client-side routing)
  │     ├── 78 lazy-loaded chunks (code splitting)
  │     ├── AuthContext (JWT in localStorage)
  │     ├── ThemeContext (CSS custom properties)
  │     └── LanguageContext (EN/PT translations)
  │
  ├── API calls → /api/*
  │
  └── Caddy reverse proxy → localhost:8080
        │
        Spring Boot 3.5
          ├── SecurityConfig (JWT filter, CORS, permitAll rules)
          ├── SpaForwardController (HTML routes → index.html)
          ├── CharacterController (CRUD for all game systems)
          ├── ChronicleController (chronicle management)
          ├── AuthController (register, login, forgot-password)
          ├── MeritController / FlawController (catalog endpoints)
          └── PostgreSQL (Hibernate auto-DDL)
```

### Decisões de Design

1. **Entidade Única de Personagem** — Uma tabela `Character` com ~250 colunas anuláveis cobre todos os 8 sistemas de jogo. Cada sistema utiliza um subconjunto de campos prefixados pelo sistema (`dnd*`, `cp*`, `blades*`, etc.) além de campos compartilhados (`name`, `concept`, `backstory`, `notes`). Isso evita joins complexos e mantém o CRUD simples.

2. **Enum Splat** — O campo `splat` (ex.: `VAMPIRE`, `BLADES`, `DND`, `CYBERPUNK`) determina qual componente de formulário é renderizado e quais campos são relevantes. O Splat também direciona a segregação de crônicas (mapa `SPLAT_TO_CATEGORY`).

3. **Lazy Loading** — Cada componente de formulário é carregado sob demanda via `React.lazy` com um wrapper `lazyRetry` que lida com hashes de chunks desatualizados após deploys (auto-reload único via flag no sessionStorage).

4. **Campos JSON em TEXT** — Dados complexos de tamanho variável (skills, cyberware, armas, equipamentos, veículos, lifepath) são armazenados como strings JSON em colunas TEXT ao invés de tabelas de entidades separadas. O frontend faz parse/serialização do JSON; o backend os trata como strings opacas.

5. **Sistema de Temas** — CSS custom properties (`--color-accent`, `--color-accent-fg`, etc.) alternam por sistema de jogo via atributo `data-theme` no elemento raiz. Oito temas: wod (vermelho), 7thsea (dourado), l5r (esmeralda), blades (carmesim), dnd (vermelho quente), uestrpg (azul aço), cyberpunk (ciano neon).

---

## Modelo de Dados

### Entidades Principais

| Entidade | Tabela | Propósito |
|----------|--------|-----------|
| `Character` | `characters` | Todos os dados de personagem para todos os sistemas (~250 colunas) |
| `AppUser` | `app_users` | Contas de usuário (username, email, hash de senha, role) |
| `Chronicle` | `chronicles` | Campanhas de jogo (nome, descrição, sistema de jogo, narrador) |
| `Merit` | `merits` | Catálogo de qualidades WoD (alimentado via JSON na primeira inicialização) |
| `Flaw` | `flaws` | Catálogo de defeitos WoD (alimentado via JSON na primeira inicialização) |
| `CharacterMerit` | `character_merits` | Tabela de junção: personagem ↔ qualidade |
| `CharacterFlaw` | `character_flaws` | Tabela de junção: personagem ↔ defeito |
| `Discipline` | `disciplines` | Sub-entidades de disciplinas/poderes WoD por personagem |
| `XpLogEntry` | `xp_log_entries` | Entradas do log de experiência por personagem |
| `ChronicleSession` | `chronicle_sessions` | Notas de sessão por crônica |

### Grupos de Campos do Personagem

| Prefixo | Sistema | Campos de Exemplo |
|---------|---------|-------------------|
| (nenhum) | Compartilhado | `name`, `concept`, `splat`, `npc`, `backstory`, `notes` |
| (nenhum) | WoD | `strength`..`wits`, `willpower`, `clan`, `generation`, `pathName` |
| `blades*` | Blades | `bladesPlaybook`, `bladesStress`, `bladesTrauma`, `bladesHunt`..`bladesSway` |
| `dnd*` | D&D/UESTRPG | `dndStrength`..`dndCharisma`, `dndLevel`, `dndHpMax`, `dndSpells` |
| `uestrpg*` | UESTRPG | `uestrpgBirthsign`, `uestrpgMagickaMax`, `uestrpgLuck` |
| `cp*` | Cyberpunk | `cpRole`, `cpHandle`, `cpInt`..`cpEmp`, `cpSkills` (JSON), `cpCyberware` (JSON) |

### Autenticação

- Tokens JWT armazenados no `localStorage` como `vtm_token`
- Hash de senha com BCrypt
- Duas roles: `PLAYER` e `STORYTELLER`
- Narradores podem visualizar todos os personagens, gerenciar crônicas, criar NPCs
- Jogadores podem apenas visualizar/editar seus próprios personagens
- Reset de senha via email (fluxo de esqueci-a-senha)

---

## Sistemas de Jogo

| Sistema | Valores de Splat | Tema | Formulários | Templates de NPC |
|---------|-----------------|------|-------------|------------------|
| World of Darkness | VAMPIRE, WEREWOLF, MAGE, HUNTER, WRAITH, CHANGELING, DEMON, BSD, MORTAL, + variantes | wod (vermelho) | 20 | 122 |
| 7th Sea 2e | SEVENTH_SEA | 7thsea (dourado) | 2 | 35 |
| L5R 4e | L5R, L5R_ANTAGONIST | l5r (esmeralda) | 2 | 37 |
| Blades in the Dark | BLADES, BLADES_CREW, BLADES_ANTAGONIST | blades (carmesim) | 3 | 23 |
| D&D 5e | DND, DND_MONSTER | dnd (vermelho quente) | 2 | 120 |
| UESTRPG | UESTRPG, UESTRPG_ANTAGONIST | uestrpg (azul aço) | 2 | 34 |
| Cyberpunk 2020 | CYBERPUNK, CYBERPUNK_ANTAGONIST | cyberpunk (ciano neon) | 2 | 25 |

### Sub-Sistemas WoD

O guarda-chuva World of Darkness cobre 20 formulários através de múltiplas linhas de jogo:

- **Vampire:** V20, Revised, Dark Ages, Victorian Age, Kindred of the East
- **Werewolf:** W20, Wyld West, Changing Breeds, Kinfolk, Totems, Black Spiral Dancers
- **Mage:** M20, Victorian Mage, Familiars
- **Outros:** Hunter: The Reckoning, Wraith: The Oblivion, Changeling: The Dreaming, Demon: The Fallen, Mortals

---

## Arquitetura do Frontend

### Estrutura de Diretórios

```
vtm-frontend/src/
├── api/                    # Clientes API Axios
│   ├── characterApi.js     # CRUD de personagem, qualidades, defeitos, log de XP
│   └── chronicleApi.js     # CRUD de crônica, sessões, convites
├── components/             # 60+ componentes
│   ├── CharacterForm.jsx   # Vampiro V20 (padrão de referência)
│   ├── WerewolfForm.jsx    # Werewolf: The Apocalypse
│   ├── MageForm.jsx        # Mage: The Ascension
│   ├── ...                 # Mais 30 componentes de formulário
│   ├── CatalogSelect.jsx   # Dropdown pesquisável com descrições
│   ├── DotRating.jsx       # Componente de avaliação 1-10
│   ├── XpLogSection.jsx    # Rastreamento de experiência (todos os sistemas)
│   ├── RulesReferenceTab.jsx # Referência de regras estática
│   ├── ExportModal.jsx     # Exportação PDF com toggles de seção
│   ├── NewCharacterModal.jsx # Fluxo unificado de criação de personagem
│   └── MeritsFlawsSection.jsx # Gerenciamento de qualidades/defeitos WoD
├── context/                # Contextos React
│   ├── AuthContext.jsx      # Estado de autenticação JWT
│   ├── ThemeContext.jsx     # Troca de tema
│   └── NewCharContext.jsx   # Modal global de novo personagem
├── data/                   # Catálogos de dados de jogo
│   ├── cyberpunkData.js    # CP2020: roles, habilidades, cyberware, armas, veículos
│   ├── cyberpunkNpcs.js    # CP2020: 25 templates de NPC
│   ├── dnd5eSpells.js      # D&D: 233 magias
│   ├── dnd5eMonsters.js    # D&D: 120 templates de monstros
│   ├── dnd5eFeats.js       # D&D: 42 talentos SRD
│   ├── mageRotes.js        # Mage: 168 rotes
│   ├── werewolfGifts.js    # Werewolf: catálogo de dons
│   ├── wodNpcs.js          # WoD: 122 templates de NPC
│   └── ...                 # Mais de 20 arquivos de dados
├── hooks/
│   └── useAutoCreate.js    # Auto-criação de personagem via parâmetros de URL
├── i18n/
│   ├── LanguageContext.jsx  # Troca de idioma
│   └── translations.js     # ~800 chaves de tradução EN + PT
├── pages/                  # Componentes de nível de página
│   ├── HomePage.jsx         # Página inicial com tutorial
│   ├── AllCharactersPage.jsx # Navegador unificado de personagens
│   ├── AllChroniclesPage.jsx # Navegador unificado de crônicas
│   └── ...                  # Páginas específicas por sistema
├── index.css               # Todos os estilos (~3000 linhas)
└── main.jsx                # Ponto de entrada da aplicação
```

### Padrões de Componentes

Cada formulário de personagem segue o mesmo padrão (veja `CharacterForm.jsx` como referência):

```jsx
// 1. Imports
import { useState, useEffect } from 'react'
import DotRating from './DotRating'
import CatalogSelect from './CatalogSelect'
import XpLogSection from './XpLogSection'
import ExportModal from './ExportModal'

// 2. Constantes
const TAB_KEYS = ['tabIdentity', 'tabAttributes', ...]
const INITIAL = { splat: 'VAMPIRE', name: '', ... }

// 3. Componente
export default function CharacterForm() {
  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [showExport, setShowExport] = useState(false)

  // Carrega personagem ao montar
  useEffect(() => { if (characterId) loadCharacter() }, [characterId])

  // Botões de aba com ARIA
  <div className="tab-list" role="tablist">
    {TAB_KEYS.map((tk, i) => (
      <button key={tk} id={`tab-${i}`} role="tab"
        aria-selected={tab === i} aria-controls={`tabpanel-${i}`}>
        {t(tk)}
      </button>
    ))}
  </div>

  // Painéis de aba com ARIA
  <div hidden={tab !== 0} role="tabpanel" id="tabpanel-0" aria-labelledby="tab-0">
    ...
  </div>

  // Modal de exportação
  <ExportModal open={showExport} onClose={() => setShowExport(false)}
    tabKeys={TAB_KEYS} t={t} />
}
```

### UX Mobile

#### Menu Hamburger de Navegação

- **Breakpoint:** Aparece em `max-width: 640px` — abaixo desta largura a barra de navegação completa colapsa em um ícone hamburger
- **Animação:** Ícone de três linhas anima para um X quando aberto (CSS transforms nos spans)
- **Fechamento:** Fecha ao pressionar Escape, clicar/tocar fora do menu, ou ao navegar (mudança de rota)
- **Acessibilidade:** Usa `aria-expanded` no botão de toggle, `aria-label="Menu"`, foco capturado enquanto aberto

#### Dropdown Colapsável de Abas

- Em viewports mobile, a barra de abas do formulário colapsa para mostrar apenas o nome da aba ativa com um indicador `▼`
- Tocar na aba ativa expande a lista completa de abas como um overlay dropdown
- Selecionar uma aba da lista navega para aquela aba e colapsa o dropdown
- Clicar/tocar fora do dropdown o fecha sem alterar a aba atual
- O dropdown utiliza a mesma semântica `role="tablist"` da barra de abas desktop

#### Toggle de Idioma

- O botão de toggle de idioma está sempre visível no header, fora do menu hamburger, para que os usuários possam alternar idiomas independentemente do estado de navegação

### Componentes Compartilhados

| Componente | Propósito |
|-----------|---------|
| `DotRating` | Avaliação de 0-10 pontos/select (atributos WoD, habilidades) |
| `CatalogSelect` | Dropdown pesquisável com descrições e navegação por setas |
| `XpLogSection` | Rastreamento de XP/IP por sistema com cálculos de custo |
| `RulesReferenceTab` | Seções de referência de regras colapsáveis |
| `ExportModal` | Exportação PDF com toggles por seção |
| `MeritsFlawsSection` | Qualidades/defeitos WoD com busca em catálogo |
| `TagInfoPanel` | Barra lateral fixa mostrando detalhes do item selecionado |
| `BladesDiceRoller` | Rolador de pool de d6 para Blades |
| `StorytellerDiceRoller` | Rolador de pool de d10 para WoD |
| `DndDiceRoller` | Rolador de d20 para D&D/UESTRPG |

---

## Arquitetura do Backend

### Controllers

| Controller | Endpoints | Propósito |
|-----------|-----------|---------|
| `AuthController` | `/api/auth/*` | Registro, login, reset de senha |
| `CharacterController` | `/api/characters/*` | CRUD de personagem, controle de acesso |
| `ChronicleController` | `/api/chronicles/*` | CRUD de crônica, sessões, convites |
| `MeritController` | `/api/merits` | Catálogo de qualidades (público) |
| `FlawController` | `/api/flaws` | Catálogo de defeitos (público) |
| `CharacterMeritController` | `/api/characters/:id/merits` | Gerenciamento de qualidades do personagem |

### Segurança

- `JwtAuthenticationFilter` — Extrai e valida JWT do header Authorization
- `RateLimitFilter` — Rate limiting nos endpoints de autenticação
- `SanitizationFilter` — Prevenção de XSS nos corpos de requisição
- `CharacterAccessChecker` — Garante que usuários só acessem seus próprios personagens (Narradores podem acessar todos)
- `SecurityConfig` — Permite rotas públicas (assets estáticos, auth, qualidades/defeitos), autentica todo o resto

### Alimentação de Dados

`DataLoader` executa na inicialização:
1. Se a tabela de qualidades estiver vazia, carrega de `vampiro_merits_flaws_en.json` (338 qualidades, 197 defeitos)
2. Sempre aplica `merits_flaws_patch.json` (adiciona entradas faltantes por nome)
3. Migração única: corrige nomes de qualidades TBD e nomes de defeitos em português

---

## Implantação

### Pipeline CI/CD (`.github/workflows/deploy.yml`)

```
Push to main
  → Build frontend (npm ci && npm run build)
  → Copy dist/* to Spring Boot static/
  → Build JAR (mvn package -DskipTests)
  → SCP JAR to EC2
  → SSH: restart spinsheets service, reload Caddy
```

### Configuração do Servidor

- Instância EC2 rodando Ubuntu
- Caddy como proxy reverso (auto-HTTPS via Let's Encrypt)
- Serviço systemd `spinsheets` executando o JAR do Spring Boot
- Banco de dados PostgreSQL (local ou gerenciado)

### Estratégia de Cache

- **Filtro `WebConfig`** (Spring Boot `OncePerRequestFilter`) define headers HTTP de cache baseados no caminho da requisição:
  - `/assets/**` → `Cache-Control: public, max-age=31536000, immutable` (nomes de arquivo com hash mudam a cada build, portanto são seguros para cache indefinido)
  - Todas as outras rotas (HTML) → `Cache-Control: no-cache, no-store, must-revalidate` (garante que o navegador sempre busque um `index.html` atualizado após deploys)
- Esta abordagem em duas camadas garante que os usuários sempre recebam o app shell mais recente enquanto se beneficiam do cache permanente para assets versionados
- Wrapper `lazyRetry` lida com chunks desatualizados após deploy (auto-reload único via flag no sessionStorage)

---

## Acessibilidade

### Conformidade WCAG 2.1 AA (~95%)

- **HTML Semântico** — Todos os formulários usam `<fieldset>`, `<legend>`, `<label>`, hierarquia adequada de headings
- **Abas ARIA** — Todos os 33 formulários possuem `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-labelledby`, `aria-controls`
- **Navegação por teclado** — Todos os elementos interativos alcançáveis via Tab, controles customizados suportam Enter/Espaço
- **Gerenciamento de foco** — Modais possuem `autoFocus`, `aria-modal`, Escape para fechar, clique fora para dispensar
- **Regiões ao vivo** — `aria-live="polite"` em conteúdo dinâmico, `role="alert"` em erros
- **Cor** — Toda informação é transmitida com texto, não apenas cor. Razões de contraste verificadas por tema
- **Mobile** — Menu hamburger com `aria-expanded`, ícone animado, fechamento por Escape/clique-fora/navegação; dropdown colapsável de abas mostra aba ativa com indicador `▼`, expande lista completa ao tocar, fecha ao clicar fora; alvos de toque atendem mínimo de 44px
- **Impressão** — Stylesheet `@media print` mostra todos os painéis de aba, esconde nav/botões, layout limpo preto-no-branco

---

## Internacionalização

- Dois idiomas: Inglês (padrão) e Português
- ~800 chaves de tradução em `translations.js`
- Hook `useLanguage()` fornece função `t(key)` e `lang`/`toggle`
- Toggle de idioma sempre visível no header
- Termos mecânicos de jogo (nomes de Disciplinas, nomes de Dons, etc.) permanecem em inglês pois são nomes próprios

---

## Resumo de Funcionalidades

### Para Jogadores
- Criar personagens em 8 sistemas de jogo
- Catálogos pesquisáveis para poderes, equipamentos, magias, cyberware
- Roladores de dados integrados correspondentes à mecânica de cada sistema
- Rastreamento de XP/IP com cálculos de custo adequados
- Exportar PDF com seções selecionáveis
- Entrar em crônicas via link de convite
- Buscar, ordenar e filtrar personagens

### Para Narradores
- Todas as funcionalidades de jogador, mais:
- Geradores de NPC com mais de 350 templates prontos
- Gerenciamento de crônicas (criar, convidar, gerenciar sessões)
- Visualizar e gerenciar fichas dos jogadores
- Mecânicas de relógio (Blades in the Dark)
- Formulários de antagonista para cada sistema
- Página de gerenciamento de jogadores
