# Spin's Sheets — Guia do Desenvolvedor

## Sumário

1. [Configuração do Ambiente Local](#configuração-do-ambiente-local)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Adicionando um Novo Sistema de Jogo](#adicionando-um-novo-sistema-de-jogo)
4. [Adicionando Templates de NPC](#adicionando-templates-de-npc)
5. [Adicionando Traduções](#adicionando-traduções)
6. [Referência de Componentes](#referência-de-componentes)
7. [Referência do Backend](#referência-do-backend)
8. [Implantação](#implantação)
9. [Padrões Comuns](#padrões-comuns)

---

## Configuração do Ambiente Local

### Pré-requisitos

- Node.js 20+
- Java 21+
- PostgreSQL
- Maven (incluído via wrapper `mvnw`)

### Frontend

```bash
cd vtm-frontend
npm install
npm run dev          # Inicia o servidor de dev Vite em http://localhost:5173
```

### Backend

```bash
cd character-sheet
# Configure o banco de dados em src/main/resources/application.properties
./mvnw spring-boot:run   # Inicia o Spring Boot em http://localhost:8080
```

### Banco de Dados

O backend usa Hibernate `ddl-auto=update`, que cria e modifica tabelas automaticamente na inicialização. Nenhuma migração manual é necessária — basta apontar para um banco de dados PostgreSQL e iniciar a aplicação.

---

## Estrutura do Projeto

```
/
├── vtm-frontend/           # Frontend React
│   ├── src/
│   │   ├── api/            # Clientes API Axios
│   │   ├── components/     # 60+ componentes (formulários, UI compartilhada)
│   │   ├── context/        # Contextos React (Auth, Theme, NewChar)
│   │   ├── data/           # Catálogos de dados de jogo (exports JS tipo JSON)
│   │   ├── hooks/          # Hooks customizados (useAutoCreate)
│   │   ├── i18n/           # Traduções (EN + PT)
│   │   ├── pages/          # Componentes de nível de página
│   │   ├── index.css       # Hub de importação (19 declarações @import)
│   │   ├── styles/         # CSS modular (19 arquivos)
│   │   │   ├── reset.css          # Reset de box-sizing
│   │   │   ├── tokens.css         # Propriedades customizadas CSS, todos os temas
│   │   │   ├── base.css           # html/body, helpers de acessibilidade
│   │   │   ├── layout.css         # Header, nav, hamburger, footer
│   │   │   ├── typography.css     # Títulos, parágrafos
│   │   │   ├── buttons.css        # Todas as variantes de botão
│   │   │   ├── forms.css          # Inputs, selects, fieldsets, tabs, ratings
│   │   │   ├── tags.css           # Sistema de tags, painel de informações
│   │   │   ├── catalog.css        # Busca do catálogo, itens
│   │   │   ├── character-list.css # Cards de personagem, layout de lista
│   │   │   ├── helpers.css        # Combobox, dicas, toggle de papel
│   │   │   ├── badges.css         # Cores de badge de splat
│   │   │   ├── homepage.css       # Homepage, cards de sistema, carrossel
│   │   │   ├── view-mode.css      # Exibição de formulário somente leitura
│   │   │   ├── splat-select.css   # Página de seleção de splat
│   │   │   ├── responsive.css     # Media queries (1024px, 640px)
│   │   │   ├── components.css     # Health track, modais, blades dots
│   │   │   ├── dice-roller.css    # Estilos do rolador de dados
│   │   │   └── print.css          # Estilos de impressão, error boundary
│   │   └── main.jsx        # Entrada da aplicação
│   └── index.html          # Shell da SPA
│
├── character-sheet/        # Backend Spring Boot
│   └── src/main/java/.../
│       ├── config/         # SecurityConfig, WebConfig, DataLoader, SpaForwardController
│       ├── controller/     # Controllers REST
│       ├── entity/         # Entidades JPA (Character, AppUser, Chronicle, etc.)
│       ├── repository/     # Repositories Spring Data JPA
│       ├── security/       # JWT, rate limiting, sanitização
│       └── service/        # Serviços de lógica de negócios
│
├── docs/                   # Documentação
└── .github/workflows/      # CI/CD (deploy.yml)
```

---

## Adicionando um Novo Sistema de Jogo

Esta é a tarefa de extensão mais comum. Siga estes passos para adicionar um sistema completo novo (usando Cyberpunk 2020 como implementação de referência):

### Passo 1: Backend — Campos da Entidade

**Arquivo:** `character-sheet/src/main/java/.../entity/Character.java`

Adicione novos campos com um prefixo de sistema (ex.: `cp*` para Cyberpunk):

```java
// ── Novo Sistema ──
private String nsRole;          // Campos simples
private Integer nsStrength;     // Stats numéricos

@Column(columnDefinition = "TEXT")
private String nsSkills;        // Dados complexos como JSON
```

**Arquivo:** `character-sheet/src/main/java/.../controller/CharacterController.java`

1. Adicione cópias de campos no método `update()`
2. Adicione valores de splat ao mapa `SPLAT_CATEGORY`

**Arquivo:** `character-sheet/src/main/java/.../controller/ChronicleController.java`

Adicione aos mapas `SPLAT_CATEGORY` e `SYSTEM_FOR_CATEGORY`.

### Passo 2: Backend — Roteamento

**Arquivo:** `SpaForwardController.java` — Adicione `/newsystem`, `/newsystem/**` ao array `@RequestMapping`

**Arquivo:** `SecurityConfig.java` — Adicione `/newsystem/**` ao matcher `permitAll`

### Passo 3: Frontend — Arquivo de Dados

**Arquivo:** `vtm-frontend/src/data/newSystemData.js`

Exporte constantes para roles, habilidades, equipamento, etc.:

```js
export const NS_ROLES = [
  { value: 'Fighter', description: 'A combat specialist' },
  // ...
]
export const NS_ROLE_CATALOG = NS_ROLES.map(r => ({ value: r.value, description: r.description }))
```

### Passo 4: Frontend — Formulário de Personagem

**Arquivo:** `vtm-frontend/src/components/NewSystemForm.jsx`

Siga o padrão em `CyberpunkForm.jsx` ou `UestrpgForm.jsx`:

```jsx
const TAB_KEYS = ['tabNsIdentity', 'tabNsStats', ...]
const INITIAL = { splat: 'NEW_SYSTEM', name: '', ... }

export default function NewSystemForm() {
  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [showExport, setShowExport] = useState(false)
  // ... hooks padrão, funções de carregar/salvar

  return (
    <div>
      {/* Lista de abas com ARIA */}
      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} id={`tab-${i}`} role="tab"
            aria-selected={tab === i} aria-controls={`tabpanel-${i}`}
            onClick={() => setTab(i)}>{t(tk)}</button>
        ))}
      </div>

      {/* Painéis de aba com ARIA */}
      <div hidden={tab !== 0} role="tabpanel" id="tabpanel-0" aria-labelledby="tab-0">
        {/* Conteúdo */}
      </div>

      {/* Modal de exportação */}
      <ExportModal open={showExport} onClose={() => setShowExport(false)}
        tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
```

### Passo 5: Frontend — Formulário de Antagonista + Dados de NPC

**Arquivo:** `vtm-frontend/src/data/newSystemNpcs.js` — Templates de NPC prontos
**Arquivo:** `vtm-frontend/src/components/NewSystemAntagonistForm.jsx` — Formulário simplificado de NPC com carregador de template

### Passo 6: Frontend — Página do Sistema

**Arquivo:** `vtm-frontend/src/pages/NewSystemPage.jsx`

Filtra personagens por splat, mostra crônicas, botões de novo personagem/antagonista.

### Passo 7: Frontend — Conexão

**Arquivo:** `App.jsx`
- Adicione imports lazy para formulário, formulário de antagonista, página
- Adicione ao `THEME_TO_CHARACTERS_PATH`
- Adicione rotas

**Arquivo:** `CharacterRouter.jsx`
- Adicione imports lazy
- Adicione roteamento por splat
- Adicione troca de tema

**Arquivo:** `CharacterList.jsx`
- Adicione ao `SPLAT_LABEL_KEYS`
- Adicione ao conjunto de filtro `NON_WOD`

**Arquivo:** `splatCategories.js`
- Adicione mapeamento splat-para-categoria

**Arquivo:** `XpLogSection.jsx`
- Adicione configuração de custo de XP específica do sistema

### Passo 8: Frontend — Estilização

**Arquivo:** `styles/tokens.css`

Adicione tokens de tema:
```css
[data-theme="newsystem"] {
  --color-border-focus:   #yourcolor;
  --color-accent:         #yourcolor;
  --color-accent-fg:      #yourcolor;
  --color-accent-hover:   #yourcolor;
}
```

Adicione estilos de card do sistema em `styles/homepage.css` e cores de badge de splat em `styles/badges.css`. Quaisquer novos estilos de componente devem ir no arquivo de módulo apropriado em `styles/`.

### Passo 9: Frontend — Traduções

**Arquivo:** `translations.js`

Adicione ~40-80 chaves para EN e PT: nome/descrição do sistema, rótulos de aba, rótulos de campo, strings de UI.

### Passo 10: Página Inicial

**Arquivo:** `HomePage.jsx`
- Adicione card do sistema
- Adicione à seção "Jogos Suportados"

### Passo 11: Páginas de Crônica e Personagem

**Arquivo:** `AllChroniclesPage.jsx` — Adicione ao array `SYSTEMS`
**Arquivo:** `AllCharactersPage.jsx` — Adicione ao array `SYSTEMS` com conjunto de splat
**Arquivo:** `NewCharacterModal.jsx` — Adicione ao array `GAME_SYSTEMS`

---

## Adicionando Templates de NPC

Templates de NPC são armazenados em arquivos de dados sob `vtm-frontend/src/data/`.

### Estrutura

```js
export const SYSTEM_PREMADE_NPCS = [
  {
    name: 'Guard Captain',
    description: 'Seasoned officer leading a squad',
    // Stats específicos do sistema...
    notes: 'Tactics: Defensive formation, calls for backup...',
  },
]

export const SYSTEM_NPC_CATALOG = SYSTEM_PREMADE_NPCS.map(n => ({
  value: n.name,
  description: n.description,
}))
```

### Carregando Templates

No formulário de antagonista:
```jsx
import { SYSTEM_PREMADE_NPCS, SYSTEM_NPC_CATALOG } from '../data/systemNpcs'

function loadTemplate(name) {
  const tmpl = SYSTEM_PREMADE_NPCS.find(t => t.name === name)
  if (!tmpl) return
  setFields(prev => ({ ...prev, ...mapTemplateToFields(tmpl) }))
}

<CatalogSelect catalog={SYSTEM_NPC_CATALOG}
  onChange={(_, v) => loadTemplate(v)} />
```

---

## Adicionando Traduções

Todas as traduções vivem em `vtm-frontend/src/i18n/translations.js`.

### Estrutura

O arquivo exporta um objeto com duas chaves de nível superior:
```js
const translations = {
  en: { key: 'English text', ... },
  pt: { key: 'Portuguese text', ... },
}
```

### Convenções

- Chaves específicas de sistema são prefixadas: `cp*` (Cyberpunk), `blades*` (Blades), `dnd*` (D&D)
- Chaves de aba: `tabCpIdentity`, `tabCpStats`, etc.
- Sempre adicione entradas em EN e PT
- Termos mecânicos de jogo (nomes de Disciplinas, nomes de Dons) permanecem em inglês — são nomes próprios
- Rótulos de UI, dicas, placeholders e legends devem ser traduzidos

### Encontrando Onde Inserir

Busque chaves existentes próximas à seção do seu sistema:
```bash
grep -n 'cpRole:' src/i18n/translations.js  # Encontrar seção Cyberpunk
```

---

## Referência de Componentes

### CatalogSelect

Dropdown pesquisável com descrições e navegação por teclado.

```jsx
<CatalogSelect
  id="unique-id"
  name="fieldName"
  label="Label Text"
  value={currentValue}
  onChange={handleField}           // (name, value) => void
  catalog={[{ value: 'Option', description: 'Desc' }]}
  placeholder="Search..."
  showDescOnSelect={true}         // Mostra descrição após seleção
  directOnChange={false}          // Se true, onChange recebe apenas o valor
/>
```

### DotRating

Componente de avaliação numérica (escala 1-10, renderizado como dropdown select).

```jsx
<DotRating
  label="Strength"
  name="strength"
  value={fields.strength}
  onChange={handleField}           // (name, value) => void
  min={0}
  max={10}
/>
```

### XpLogSection

Rastreamento de experiência com cálculos de custo por sistema.

```jsx
<XpLogSection
  splat="cyberpunk"               // Identificador do sistema
  xpLog={xpLog}                   // Array de entradas do log
  onAdd={async (entry) => {...}}  // Callback de adição
  onRemove={async (id) => {...}}  // Callback de remoção
  onError={(msg) => {...}}        // Callback de erro
  t={t}                           // Função de tradução
/>
```

### ExportModal

Exportação PDF com toggles por seção.

```jsx
<ExportModal
  open={showExport}
  onClose={() => setShowExport(false)}
  tabKeys={TAB_KEYS}              // Array de strings de chaves de aba
  t={t}                           // Função de tradução
/>
```

---

## Referência do Backend

### Adicionando Campos à Entidade Character

1. Adicione o campo em `Character.java`
2. Adicione a cópia do campo em `CharacterController.update()`
3. Hibernate auto-DDL cria a coluna na próxima reinicialização
4. Nenhum script de migração é necessário

### Controle de Acesso

- `CharacterAccessChecker.getCurrentUser()` — Retorna o `AppUser` autenticado
- `CharacterAccessChecker` concede aos Narradores acesso a todos os personagens
- Jogadores só podem acessar personagens onde `owner.id == user.id`

### Segregação de Crônicas

Crônicas são segregadas por sistema de jogo via:
- Mapa `SPLAT_CATEGORY` — Mapeia valores de splat para categorias de sistema
- Mapa `SYSTEM_FOR_CATEGORY` — Mapeia categorias para sistemas de jogo
- `isSplatAllowed()` — Verifica se o splat de um personagem é permitido em uma crônica

---

## Implantação

### Automática (CI/CD)

Push para `main` aciona o workflow do GitHub Actions:

```
Push → Build frontend → Copy to static → Build JAR → SCP to EC2 → Restart service
```

### Manual

```bash
# Frontend
cd vtm-frontend && npm run build

# Copiar para Spring Boot
cp -r dist/* ../character-sheet/src/main/resources/static/

# Backend
cd ../character-sheet && ./mvnw package -DskipTests

# Deploy
scp target/*.jar user@server:/opt/spinsheets/app.jar
ssh user@server 'sudo systemctl restart spinsheets'
```

---

## Padrões Comuns

### Armazenamento de Campos JSON

Para dados de tamanho variável (habilidades, equipamento, etc.):

```jsx
// Parse
const skills = (() => { try { return JSON.parse(fields.cpSkills) || [] } catch { return [] } })()

// Atualizar
function setSkills(next) {
  handleField('cpSkills', JSON.stringify(next))
}
```

### Sistema de Abas (compatível com ARIA)

```jsx
// Botões de aba
<button id={`tab-${i}`} role="tab" aria-selected={tab === i}
  aria-controls={`tabpanel-${i}`} onClick={() => setTab(i)}>

// Painéis de aba
<div hidden={tab !== i} role="tabpanel" id={`tabpanel-${i}`}
  aria-labelledby={`tab-${i}`}>
```

### Troca de Tema

```jsx
const { switchTheme } = useTheme()
useEffect(() => { switchTheme('cyberpunk') }, [])
```

### Hook de Auto-Criação

Lida com parâmetros de query `?npc=true` e `?chronicle=X`:

```jsx
const { isAutoCreating } = useAutoCreate(characterId, INITIAL)
if (isAutoCreating) return <p>Loading...</p>
```

### Padrão de Salvamento de Formulário

```jsx
async function handleSave() {
  setSaving(true); setSaveError(null)
  try { await updateCharacter(characterId, fields) }
  catch { setSaveError(t('failedToSave')) }
  finally { setSaving(false) }
}

async function handleDoneEditing() {
  await handleSave()
  navigate('/system-page')
}
```
