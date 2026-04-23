# Spin's Sheets — Documento de Design

## Visão Geral

Spin's Sheets é um gerenciador de fichas de personagem para RPG de mesa baseado na web, suportando 9 sistemas de jogo com 37 formulários de personagem, mais de 400 templates de NPCs, gerenciamento de crônicas e roladores de dados integrados. A aplicação é totalmente bilíngue (Inglês / Português) e projetada para uso em desktop e dispositivos móveis.

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

1. **Entidade Única de Personagem** — Uma tabela `Character` com ~250 colunas anuláveis cobre todos os 9 sistemas de jogo. Cada sistema utiliza um subconjunto de campos prefixados pelo sistema (`dnd*`, `cp*`, `blades*`, etc.) além de campos compartilhados (`name`, `concept`, `backstory`, `notes`). Isso evita joins complexos e mantém o CRUD simples.

2. **Enum Splat** — O campo `splat` (ex.: `VAMPIRE`, `BLADES`, `DND`, `CYBERPUNK`) determina qual componente de formulário é renderizado e quais campos são relevantes. O Splat também direciona a segregação de crônicas (mapa `SPLAT_TO_CATEGORY`).

3. **Lazy Loading** — Cada componente de formulário é carregado sob demanda via `React.lazy` com um wrapper `lazyRetry` que lida com hashes de chunks desatualizados após deploys (auto-reload único via flag no sessionStorage).

4. **Campos JSON em TEXT** — Dados complexos de tamanho variável (skills, cyberware, armas, equipamentos, veículos, lifepath) são armazenados como strings JSON em colunas TEXT ao invés de tabelas de entidades separadas. O frontend faz parse/serialização do JSON; o backend os trata como strings opacas.

5. **Sistema de Temas** — CSS custom properties (`--color-accent`, `--color-accent-fg`, etc.) alternam por sistema de jogo via atributo `data-theme` no elemento raiz. Nove temas: wod (vermelho), 7thsea (dourado), l5r (esmeralda), blades (carmesim), dnd (vermelho quente), uestrpg (azul aço), cyberpunk (ciano neon), asoiaf (dourado pergaminho).

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
| 7th Sea 2e | SEVENTH_SEA, SEVENTH_SEA_SHIP | 7thsea (dourado) | 3 | 74 |
| L5R 4e | L5R, L5R_ANTAGONIST | l5r (esmeralda) | 2 | 37 |
| L5R 5e (FFG) | L5R_5E | l5r (esmeralda) | 1 | 0 |
| Blades in the Dark | BLADES, BLADES_CREW, BLADES_ANTAGONIST | blades (carmesim) | 3 | 23 |
| D&D 5e | DND, DND_MONSTER | dnd (vermelho quente) | 2 | 120 |
| UESTRPG | UESTRPG, UESTRPG_ANTAGONIST | uestrpg (azul aço) | 2 | 34 |
| Cyberpunk 2020 | CYBERPUNK, CYBERPUNK_ANTAGONIST | cyberpunk (ciano neon) | 2 | 25 |
| ASOIAF RPG | ASOIAF | asoiaf (dourado pergaminho) | 1 | 27 |

### Blades in the Dark

Blades utiliza um **Gerenciador de Relógios** dedicado em `/blades/clocks` (relógios não estão embutidos nas fichas de personagem ou crew). Fichas de personagem incluem uma aba **Coin & Stash** (4 pips de coin para dinheiro disponível, 40 pips de stash com aposentadoria em 40/40). Fichas de crew incluem uma aba **Coin & Vault** (número de coin líquido + trilha de vault com 8 segmentos). A aba Referência de Regras inclui um guia de **XP & Avanço**.

**Reorganizacao de abas da ficha de personagem:** A antiga aba combinada de estresse/carga/projetos agora sao tres abas separadas — **Stress & Harm** (pips de estresse, trauma, trilha de ferimentos), **Loadout** (selecao de itens com exibicao de capacidade de carga), e **Projects** (relogios de projetos de longo prazo).

**Adições à ficha de crew:**
- **Rastreador de Fações** — todas as 26 facções de Doskvol renderizadas com escala de pontos de -3 a +3 para rastreamento de reputação
- **Rastreador de Territórios** — territórios disputáveis nomeados exibidos como grade de distritos; territórios conquistados destacados
- **Auto-escalonamento do Vault** — o upgrade de Vault na lista de upgrades aumenta automaticamente a capacidade do vault quando adquirido
- **Relógios de projetos de longo prazo** — relógios SVG em formato de pizza na ficha de crew (4, 6, 8 ou 12 segmentos), separados do Gerenciador de Relógios do Narrador
- **Lembrete de Barganho do Diabo** — nota inline exibida junto às mecânicas de rolagem de ação para sugerir ofertas na mesa

### Dados e Navio 7th Sea

Os dados de 7th Sea estao consolidados em `sevenSeaData.js` (111KB), provenientes de todos os 13 suplementos (adicionado livro de Sociedades Secretas): 37 nacoes (era 13), 235+ vantagens (era ~48 com custos incorretos), 161 antecedentes (era 31), 33 estilos de duelo (era 11), 26 sociedades secretas (era 0), 44 cartas de arcana (era 20 com nomes errados). Todos os catalogos incluem campos `source` para filtragem por livro-fonte. Bonus de tracos nacionais sao auto-aplicados na selecao de nacao. A ficha de Heroi inclui rastreamento de ferimentos, calculos de recompensa de historia e avisos de tracos de duelo. O formulario de Vilao suporta vantagens completas, estilos de duelo, rastreamento de esquemas e arcana corretos.

**Reorganizacao de abas da ficha de Heroi (16 abas no total):**
- Aba Arcana dividida em **Arcana** (cartas de virtude/hybris e efeitos mecanicos) e **Recursos** (PV, riqueza, ferimentos)
- Nova aba **Sociedades Secretas**: navegue pelas 26 sociedades, registre rank/hierarquia e metodo de entrada, baseado no livro de Sociedades Secretas

A ficha de Heroi tambem suporta 10 funcionalidades de automacao no modo guiado: auto-aplicacao de antecedente (concede automaticamente +1 rank em habilidades e vantagens ao selecionar), botao de adicao rapida de feiticaria (um clique para adicionar a tradicao de feiticaria da nacao), exibicao de efeitos mecanicos de Virtude/Hubris, contador de orcamento de antecedentes (X/2), contagem corrente de custo de vantagens (Gasto: X/5 pts), destaque de pool de dados para sinergias fortes, dicas de sinergia antecedente-vantagem (badges "Recomendado"), auto-sugestao de religiao por nacao (reordena por afinidade cultural), Pontos de Heroi travados em 1 no modo guiado, e exibicao de quirk com estilo de badge de Ponto de Heroi.

O Construtor de Navios de 7th Sea e desacoplado como uma ficha independente (splat `SEVENTH_SEA_SHIP`), com 15 origens de navio (era 9) e 12 antecedentes de navio (era 8).

### L5R 5a Edicao (FFG)

L5R 5e utiliza o sistema de dados narrativos FFG com 5 Aneis (Ar, Terra, Fogo, Agua, Vazio classificados de 1-5) e dados customizados d6+d12 com simbolos de Sucesso, Sucesso Explosivo, Oportunidade e Conflito. A ficha cobre dados de todos os 10 suplementos (Livro Base, Courts of Stone, Shadowlands, Fields of Victory, Celestial Realms, Path of Waves, Children of Five Winds, Writ of the Wilds, Minor Clans, Mantis DLC) com ~89 escolas, ~70 familias, 30+ clas, 230+ tecnicas, 60+ vantagens, 60+ desvantagens. Funcionalidades incluem rastreamento de Conflito/Compostura, tensao narrativa Ninjo/Giri, filtros de categoria em tecnicas, vantagens e armas, e escolas filtradas pelo cla selecionado. Um rolador de dados narrativo customizado renderiza o conjunto de simbolos FFG.

### ASOIAF RPG

A Song of Ice and Fire RPG utiliza 19 habilidades classificadas de 1-7 com especialidades e pontos de destino. A ficha inclui 60+ beneficios, 28 desvantagens, 28 armas, 10+ tipos de armadura, criacao de Casa com 7 recursos (0-70 cada), sistema de intriga (compostura, disposicao), 27 templates de NPC e um rolador de pool de d6. Utiliza o tema dourado pergaminho.

### Sub-Sistemas WoD

O guarda-chuva World of Darkness cobre 20 formulários através de múltiplas linhas de jogo:

- **Vampire:** V20, Revised, Dark Ages, Victorian Age, Kindred of the East
- **Werewolf:** W20, Wyld West, Changing Breeds, Kinfolk, Totems, Black Spiral Dancers — Dons e Ritos agora estao em abas separadas
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
│   ├── sevenSeaData.js     # 7th Sea: 111KB, todos os 12 suplementos (nacoes, vantagens, etc.)
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
├── index.css               # Hub de importação (19 declarações @import)
├── styles/                 # CSS modular (19 arquivos)
│   ├── reset.css          # Reset de box-sizing
│   ├── tokens.css         # Propriedades customizadas CSS, todos os temas
│   ├── base.css           # html/body, helpers de acessibilidade
│   ├── layout.css         # Header, nav, hamburger, footer
│   ├── typography.css     # Títulos, parágrafos
│   ├── buttons.css        # Todas as variantes de botão
│   ├── forms.css          # Inputs, selects, fieldsets, tabs, ratings
│   ├── tags.css           # Sistema de tags, painel de informações
│   ├── catalog.css        # Busca do catálogo, itens
│   ├── character-list.css # Cards de personagem, layout de lista
│   ├── helpers.css        # Combobox, dicas, toggle de papel
│   ├── badges.css         # Cores de badge de splat
│   ├── homepage.css       # Homepage, cards de sistema, carrossel
│   ├── view-mode.css      # Exibição de formulário somente leitura
│   ├── splat-select.css   # Página de seleção de splat
│   ├── responsive.css     # Media queries (1024px, 640px)
│   ├── components.css     # Health track, modais, blades dots
│   ├── dice-roller.css    # Estilos do rolador de dados
│   └── print.css          # Estilos de impressão, error boundary
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
- **Posição:** Ícone alinhado à esquerda no header (anteriormente à direita)
- **Animação:** Ícone de três linhas anima para um X quando aberto (CSS transforms nos spans)
- **Fechamento:** Fecha ao pressionar Escape, clicar/tocar fora do menu, ou ao navegar (mudança de rota)
- **Acessibilidade:** Usa `aria-expanded` no botão de toggle, `aria-label="Menu"`, foco capturado enquanto aberto
- **Correção de corte do dropdown:** O overlay do menu usa `position: fixed` com `z-index` elevado para evitar corte em fichas com containers `overflow: hidden`

#### Carrossel de Seleção de Sistema

- No desktop, a página inicial exibe uma grade responsiva de cards de sistema (9 sistemas)
- No mobile (< 640px), a grade é substituída por um carrossel de card único com botões de seta anterior/próximo e indicadores de pontos
- Um sistema é visível por vez; as setas navegam entre eles
- Indicadores de pontos abaixo permitem saltar diretamente para qualquer sistema
- Acessibilidade: `role="region"` com `aria-roledescription="carousel"`, `aria-live="polite"` na faixa para anúncios de leitores de tela, `aria-label` dinâmico nas setas mostrando o nome do sistema de destino, pontos usam `role="tab"` com `aria-selected`

#### Dropdown Colapsável de Abas

- Em viewports mobile, a barra de abas do formulário colapsa para mostrar apenas o nome da aba ativa com um indicador `▼`
- Tocar na aba ativa expande a lista completa de abas como um overlay dropdown
- Selecionar uma aba da lista navega para aquela aba e colapsa o dropdown
- Clicar/tocar fora do dropdown o fecha sem alterar a aba atual
- O dropdown utiliza a mesma semântica `role="tablist"` da barra de abas desktop

#### Carrossel de Abas

- **Setas Anterior/Próxima:** Botões de seta flanqueiam o dropdown colapsado de abas no mobile, permitindo navegação sequencial de abas sem abrir o dropdown
- **ARIA Labels Dinâmicos:** Cada seta mostra o nome da aba de destino — ex.: `aria-label="Anterior: Stats"`, `aria-label="Próxima: Combate"` — para que leitores de tela anunciem para onde o usuário está indo
- **Estado Desabilitado:** A seta anterior é desabilitada na primeira aba; a seta próxima é desabilitada na última aba. Setas desabilitadas são visualmente esmaecidas e excluídas da ordem de tabulação
- **Wrapper de Grupo:** O carrossel (seta anterior + dropdown + seta próxima) é envolvido em `role="group"` com `aria-label="Navegação de abas"` para contexto de leitores de tela
- **Atualização Automática:** Os labels das setas atualizam dinamicamente a cada mudança de aba para sempre refletir as abas vizinhas corretas

#### Barra de Ações Inferior Fixa

- Em viewports mobile, os botões de ação do formulário (Salvar, Exportar PDF, Cancelar) ficam fixos na parte inferior da tela via `position: sticky`
- Um separador sutil de sombra distingue a barra de ações do conteúdo rolável acima
- Os botões permanecem sempre visíveis e acessíveis ao polegar independentemente da posição de rolagem
- A barra se integra ao fluxo normal do documento no desktop onde não é necessária

#### Suporte a PWA

- **manifest.json** configurado com `"display": "standalone"` para experiência semelhante a app nativo quando instalado
- **Service Worker** faz cache de assets com hash (JS, CSS, imagens) usando estrategia cache-first para carregamentos instantaneos, e faz cache de HTML usando network-first com pagina de fallback offline. Um bump de versao de cache e correcao de rotas de navegacao SPA resolveram falhas anteriores de carregamento no mobile
- **Apple Meta Tags** (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-touch-icon`) habilitam instalação em tela cheia na home screen no iOS Safari
- O app pode ser instalado via "Adicionar à Tela Inicial" tanto no iOS quanto no Android

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
| `L5r5eDiceRoller` | Rolador de dados narrativos customizado para L5R 5e (simbolos FFG) |
| `AsoiafDiceRoller` | Rolador de pool de d6 para ASOIAF RPG |

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
- **Abas ARIA** — Todos os 37 formulários possuem `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-labelledby`, `aria-controls`
- **Navegação por teclado** — Todos os elementos interativos alcançáveis via Tab, controles customizados suportam Enter/Espaço
- **Gerenciamento de foco** — Modais possuem `autoFocus`, `aria-modal`, Escape para fechar, clique fora para dispensar
- **Regioes ao vivo** — `aria-live="polite"` em todo conteudo dinamico incluindo avisos de auto-calculo, `role="alert"` em erros e avisos de limite
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

### Para Todos
- **PWA instalável** — Adicione à Tela Inicial no iOS ou Android para uma experiência semelhante a app nativo com suporte offline e tempos de carregamento instantâneos

### Para Jogadores
- Criar personagens em 9 sistemas de jogo
- **Auto-calculos e avisos** em todas as fichas — avisos de maldicao de cla (Vampire), limitacao de esferas e avisos de Paradoxo (Mage), modificadores de stat por forma (Werewolf), aumento de atributo racial auto-aplicado e sugestoes de HP/AC (D&D/UESTRPG), avisos de BTM/humanidade/cyberpsicose (Cyberpunk), rastreamento de estresse/carga (Blades), aplicacao automatica de tracos nacionais, auto-aplicacao de antecedentes com orcamentos no modo guiado, adicao rapida de feiticaria e rastreamento de ferimentos (7th Sea), auto-calculo de rank de Insight (L5R), alem de limites de Banalidade/Corpus/Tormento/Conviccao/Dharma para os demais splats WoD
- **Modo de visualização** — dropdowns de seleção de template (carregamento de NPC, seleção de playbook, etc.) são ocultados quando uma ficha está em modo somente leitura para reduzir ruído visual
- Catalogos pesquisaveis para poderes, equipamentos, magias, cyberware — com filtros de livro-fonte quando aplicavel
- Roladores de dados integrados correspondentes a mecanica de cada sistema
- Rastreamento de XP/IP com calculos de custo adequados
- Exportar PDF com secoes selecionaveis
- Entrar em cronicas via link de convite
- Buscar, ordenar e filtrar personagens

### Para Narradores
- Todas as funcionalidades de jogador, mais:
- Geradores de NPC com mais de 400 templates prontos
- Gerenciamento de crônicas (criar, convidar, gerenciar sessões)
- Visualizar e gerenciar fichas dos jogadores
- Gerenciador de Relógios dedicado para Blades in the Dark (`/blades/clocks`)
- Formulários de antagonista para cada sistema
- Página de gerenciamento de jogadores
- **Páginas de Ferramentas do Narrador (ST Tools)** — cada um dos 7 sistemas principais (Blades, WoD, Cyberpunk, D&D, 7th Sea, L5R, ASOIAF) possui uma página de ferramentas exclusiva para Narradores, acessível a partir do hub do sistema. Essas páginas oferecem geradores e referências rápidas organizados em abas: geração de scores, geradores de NPC, tabelas de encontro, gerenciamento de facções, auxiliares de tempo livre, entre outros. 37 abas no total. Totalmente bilíngues EN + PT. Cada página de ST Tools é um componente React independente carregado sob demanda a partir da rota do hub do sistema.
