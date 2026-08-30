# FinPortfolio - Frontend (Architecture Hexagonale)

Frontend React/TypeScript pour l'API FastAPI **FinPortfolio**, construit selon les
principes de l'**architecture hexagonale (Ports & Adapters)**, en miroir du backend.

```
Backend  : FastAPI -> Application -> Domain -> Ports ← SQLAlchemy Adapter
Frontend : React   -> Hooks       -> Use Cases -> Ports ← HTTP Adapter ← Axios
```

## 1. Présentation du projet

FinPortfolio permet de gérer des investisseurs, des portefeuilles d'investissement,
des instruments financiers et des ordres d'achat/vente, avec valorisation et P&L
calculés côté backend.

Ce frontend consomme l'API REST du backend **sans jamais laisser React, Axios ou
TanStack Query fuiter dans la logique métier**.

## 2. Architecture

```
src/
├── domain/            -> cœur métier, zéro dépendance externe
├── application/        -> Use Cases + Ports (interfaces)
├── adapters/
│   ├── outbound/http/  -> implémentations HTTP des Ports (Axios)
│   └── inbound/ui/      -> React : pages, composants, hooks, routes
├── infrastructure/     -> DI container, config env, QueryClient
└── shared/              -> utilitaires transverses (formatage, routes)
```

### Direction des dépendances

```
React Components
      │
      ▼
  React Hooks
      │
      ▼
  Use Cases
      │
      ▼
Repository Ports (interfaces)
      ▲
      │
HTTP Repository Adapter
      │
      ▼
    Axios
      │
      ▼
 FastAPI API
```

Le **Domain** n'importe jamais React, Axios, TanStack Query, React Router ou
Tailwind. L'**Application** (Use Cases) n'importe jamais Axios ni une URL d'API :
elle dépend uniquement des **Ports** (interfaces TypeScript). Les **Adapters**
implémentent ces Ports et sont les seuls à connaître Axios / REST / le DOM.

## 3. Domain (`src/domain`)

- **Entités** : `Investor`, `Portfolio`, `FinancialInstrument`, `Order`, `Position`,
  `Transaction`.
- **Value Objects** : `Decimal` (arithmétique BigInt sans erreur d'arrondi flottant),
  `Money` (montant + devise, formatage `"12 000,00 MAD"`), `Currency`.
- **Services** : `PortfolioValuationService`, `ProfitLossService` - calculs purs,
  testables sans backend :
  ```ts
  const valuation = PortfolioValuationService.calculate(positions, instruments, "MAD");
  ```

**Règle absolue** : jamais de `number` JavaScript pour représenter un montant
financier - toujours `Decimal`/`Money`, pour éviter `0.1 + 0.2 !== 0.3`.

## 4. Application (`src/application`)

- **Ports** (`ports/`) : interfaces `InvestorRepository`, `PortfolioRepository`,
  `InstrumentRepository`, `OrderRepository`, `HealthRepository`.
- **Use Cases** (`use-cases/`) : un Use Case par fonctionnalité (ex.
  `CreateOrderUseCase`, `ExecuteOrderUseCase`). Chacun dépend uniquement d'un Port,
  injecté au constructeur - jamais d'Axios, jamais de React.
- **DTO** (`dto/`) : formes d'entrée des Use Cases de création.

## 5. Adapters

### Outbound (`adapters/outbound/http`)
- `axios/axiosInstance.ts` - instance Axios centralisée (base URL, timeout).
- `axios/HttpClient.ts` - seul point de contact avec Axios ; traduit les erreurs
  HTTP (400/404/409/500/réseau) en `ApplicationError` avec un message utilisateur
  clair (jamais de détail technique brut).
- `mappers/` - traduisent les réponses JSON **snake_case** du backend
  (`created_at`, `instrument_type`…) en entités Domain **camelCase**.
- `repositories/Http*Repository.ts` - implémentent les Ports de l'Application.
- `outbound/telemetry/` - `TelemetryPort` + `ConsoleTelemetryAdapter` (voir §9).

### Inbound (`adapters/inbound/ui`)
- `pages/` - une page par route.
- `components/` - composants React organisés par sous-domaine.
- `hooks/` - hooks TanStack Query qui appellent les Use Cases (jamais Axios).
- `routes/AppRoutes.tsx` - table de routage React Router.

#### Layout (`components/layout`)
- `navigation.ts` - source unique de la navigation métier (`NAV_GROUPS`,
  groupée par domaine : Aperçu / Portefeuilles / Marchés / Système) et du
  fil d'Ariane (`getBreadcrumbTrail`), consommée à la fois par `Sidebar` et
  `MobileNav` pour éviter toute duplication.
- `Sidebar.tsx` - navigation desktop (`md:` et plus), fixe, groupée par
  section.
- `Topbar.tsx` - barre supérieure : déclencheur de nav mobile, fil
  d'Ariane, badge d'environnement, statut live du backend, menu compte.
- `MobileNav.tsx` - même navigation que `Sidebar`, affichée dans un `Sheet`
  (`side="left"`) piloté par `AppLayout`, pour les écrans `< md`.
- `AppLayout.tsx` - assemble `Sidebar` + `Topbar` + le `Sheet` de nav
  mobile ; c'est le seul composant qui possède l'état d'ouverture du menu
  mobile (`useState`), passé au `Topbar` en callback.

## 6. Dependency Injection (`src/infrastructure/di/container.ts`)

Seul endroit de l'application qui construit concrètement
`HTTP Client -> Repositories -> Use Cases`. Les composants React ne font jamais
`new Axios()`, `new HttpXxxRepository()` ni `new XxxUseCase()` : ils importent
`container` et consomment les Use Cases déjà assemblés.

## 7. React comme Adapter Inbound

React est un **Adapter Inbound** : il reçoit les interactions de l'utilisateur et
les traduit en appels de Use Cases. Il ne contient aucune règle métier - seulement
de l'orchestration (formulaires, affichage, navigation).

## 8. TanStack Query

TanStack Query reste **cantonné à la couche UI** (`hooks/`). Il gère le cache, le
`staleTime`, les invalidations - des préoccupations d'interface, pas de domaine.
Les Use Cases ne savent pas que TanStack Query existe.

## 9. Observabilité frontend

Le backend est instrumenté avec OpenTelemetry. Le frontend prévoit une abstraction
minimale : `TelemetryPort` (`trackEvent`, `trackError`, `trackPerformance`), avec
une implémentation `ConsoleTelemetryAdapter` pour l'instant.

```
UI Event -> TelemetryPort -> ConsoleAdapter        (aujourd'hui)
UI Event -> TelemetryPort -> OpenTelemetryAdapter   (demain)
```

Ajouter OpenTelemetry plus tard consiste à écrire un nouvel Adapter implémentant
`TelemetryPort` et à le brancher dans `container.ts` - zéro changement dans le
Domain, l'Application ou les composants.

## 10. Mapping API / Domain

Le backend sérialise en `snake_case` (`investor_id`, `current_price`, montants en
chaînes décimales). Chaque `*Mapper.ts` (dans `adapters/outbound/http/mappers/`)
est l'unique endroit où cette différence de convention est gérée, et où les
chaînes décimales sont converties en `Decimal`/`Money`.

## 11. Particularité du backend : pas de listes globales

Le backend n'expose **aucun** `GET /investors` ni `GET /portfolios` (liste) - dans
son cahier des charges hexagonal, ces listes ne sont pas triviales à exposer
publiquement pour une API financière. Seuls `POST` et `GET /{id}` existent.

Pour offrir tout de même des pages "liste" utilisables, l'UI mémorise localement
(`localStorage`, voir `adapters/inbound/ui/utils/localEntityRegistry.ts`) les
identifiants créés ou consultés dans la session, puis récupère chaque entité via
le Use Case `getById` existant. C'est une préoccupation d'Adapter UI (stockage
navigateur), pas une règle métier : elle ne touche ni le Domain ni l'Application.

## 12. Configuration

`.env.example` :
```
VITE_APP_NAME=FinPortfolio
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_ENV=development
```

Seul `src/infrastructure/config/environment.ts` lit `import.meta.env` - aucun
autre fichier n'y accède directement.

## 13. Lancement local

```bash
cp .env.example .env
npm install
npm run dev
```

Frontend : http://localhost:5173
Backend attendu sur : http://localhost:8000 (Swagger : http://localhost:8000/docs)

## 14. Tests

```bash
npm run test
```

- **Domain** (`Money`, `PortfolioValuationService`, `ProfitLossService`) : aucune
  dépendance à React, Axios, HTTP ou le navigateur.
- **Application** (Use Cases) : testés avec des `Fake*Repository` en mémoire - pas
  d'Axios, pas d'API réelle :
  ```ts
  const repository = new FakeOrderRepository();
  const useCase = new ExecuteOrderUseCase(repository);
  await useCase.execute(orderId);
  ```
- **Adapters** : test du mapping `InstrumentMapper` (snake_case -> Domain).
- **UI** : `InvestorForm` (avec `container` mocké - jamais d'Axios réel dans un
  test de composant), `PortfolioPositionsTable`.

## 15. Communication avec le backend

Toute requête HTTP suit le chemin :
`Composant -> Hook -> Use Case -> Port -> HttpRepository -> HttpClient -> Axios -> FastAPI`.

---

## Questions d'architecture

**1. Pourquoi React est un Adapter Inbound ?**
Il reçoit des événements venant de l'extérieur du cœur applicatif (clics,
saisies) et les traduit en appels de Use Cases - exactement le rôle d'un adapter
"driving" en hexagonal.

**2. Pourquoi Axios est un Adapter Outbound ?**
Il permet à l'application d'atteindre un système externe (l'API REST) - un
adapter "driven", piloté par l'Application via le Port `HttpClient`/Repository.

**3. Pourquoi TanStack Query doit rester dans la couche UI ?**
C'est une préoccupation de cache et de synchronisation d'état d'interface, pas
une règle métier. Le Domain et l'Application n'ont pas besoin de savoir qu'une
donnée est "stale" ou "en cache".

**4. Pourquoi les Use Cases ne doivent pas connaître Axios ?**
Pour rester testables avec un Fake Repository et pour permettre de remplacer
Axios (par `fetch`, par un mock, par une autre API) sans toucher à une seule
ligne de logique métier.

**5. Pourquoi les Repository Ports permettent de remplacer l'API ?**
Parce que les Use Cases dépendent d'une interface, pas d'une implémentation :
n'importe quelle classe qui respecte le contrat du Port peut être substituée
(HTTP, GraphQL, mock, IndexedDB…).

**6. Comment remplacer Axios par `fetch` sans modifier les Use Cases ?**
Réécrire uniquement `HttpClient.ts` (mêmes méthodes `get`/`post`, implémentation
interne en `fetch`) ; aucun autre fichier de `application/` ou `domain/` ne change.

**7. Comment remplacer React par un autre framework sans toucher Domain et
Application ?**
Domain et Application ne contiennent aucun import React. Un nouveau frontend
(Vue, Svelte…) réimplémente uniquement `adapters/inbound/ui/`, en import
tant les mêmes Use Cases depuis `application/`.

**8. Comment tester le frontend sans backend réel ?**
En injectant des `Fake*Repository` (implémentations en mémoire des Ports) dans
les Use Cases, comme démontré dans `application/use-cases/__tests__/`.

**9. Cohérence avec le backend FastAPI hexagonal ?**
Les deux applications suivent la même direction de dépendance
(UI/Framework -> Application -> Domain ← Ports ← Adapters d'infrastructure) et
communiquent uniquement via le contrat REST, sans coupler leurs internes.

**10. Comment ajouter OpenTelemetry frontend sans polluer le Domain ?**
En écrivant un `OpenTelemetryAdapter implements TelemetryPort` dans
`adapters/outbound/telemetry/`, puis en le branchant dans `container.ts` à la
place de `ConsoleTelemetryAdapter`. Le Domain n'a jamais connu `TelemetryPort` ;
seule la couche UI l'utilise pour instrumenter ses événements.
