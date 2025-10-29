# 📚 Documentación del Framework

## Guías y Referencias Útiles

### 📖 Contenido

1. **[README.md](README.md)** - Documentación principal del proyecto
2. **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Estado actual del framework y métricas
3. **[.env.example](.env.example)** - Plantilla de variables de entorno

---

## 🚀 Quick Start

### Configuración Inicial
```bash
# 1. Clonar el repositorio
git clone https://github.com/faridmaloof/automation_framework.git
cd automation_framework

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 4. Ejecutar tests
npm test
```

---

## 📊 Estado del Framework

**Última actualización**: 28 de Octubre, 2025

- ✅ Framework 100% operativo
- ✅ Cucumber + Screenplay Pattern implementado
- ✅ Logger Pino async integrado
- ✅ Tests API REST funcionando (7/7 passed)
- ✅ Reportes HTML/JSON generados
- ✅ TypeScript sin errores
- ✅ Git repository inicializado

---

## 🗂️ Organización del Proyecto

### Directorios Principales

```
automation/
├── features/          # Cucumber features (Gherkin)
├── steps/             # Step definitions
├── support/           # Cucumber support (world, hooks)
├── src/               # Screenplay Pattern implementation
│   ├── actors/        # Actores del sistema
│   ├── abilities/     # Habilidades (API, Web, DB)
│   ├── tasks/         # Tareas de alto nivel
│   ├── questions/     # Preguntas/Assertions
│   ├── schemas/       # JSON Schemas para validación
│   └── helpers/       # Utilidades (logger, etc.)
├── reports/           # Reportes generados (HTML/JSON)
├── logs/              # Logs de ejecución
└── scripts/           # Scripts de utilidad
```

---

## 🧪 Tests Disponibles

### Scripts NPM

| Script | Descripción | Comando |
|--------|-------------|---------|
| `test` | Ejecuta todos los tests | `npm test` |
| `test:smoke` | Tests de humo (quick check) | `npm run test:smoke` |
| `test:regression` | Suite completa de regresión | `npm run test:regression` |
| `test:api:rest` | Solo tests API REST | `npm run test:api:rest` |
| `test:api:rest:smoke` | API REST smoke tests | `npm run test:api:rest:smoke` |
| `test:web` | Solo tests Web (Playwright) | `npm run test:web` |
| `test:parallel` | Tests en paralelo | `npm run test:parallel` |
| `clean` | Limpia reportes y logs | `npm run clean` |
| `format` | Formatear código (Prettier) | `npm run format` |
| `lint` | Linter (ESLint) | `npm run lint` |

### Tags Disponibles

- `@smoke` - Tests críticos de humo
- `@regression` - Suite completa de regresión
- `@api` - Tests de API
- `@rest` - Tests REST API
- `@graphql` - Tests GraphQL API
- `@web` - Tests de UI Web
- `@chrome` - Tests específicos para Chrome
- `@negative` - Tests de casos negativos
- `@validation` - Tests de validación de datos
- `@schema` - Tests de validación de schema

---

## 🔧 Configuración

### Variables de Entorno

Copia `.env.example` a `.env` y ajusta los valores:

```bash
# Environment
ENV=dev
NODE_ENV=development

# Browser
HEADLESS=true
BROWSER=chromium

# Timeouts
DEFAULT_TIMEOUT=30000
API_TIMEOUT=30000

# ⚠️ API Base URL - REQUERIDO
# Solo el dominio base, sin paths (/api, /v1, etc.)
# ✅ Correcto:   https://api.example.com
# ❌ Incorrecto: https://api.example.com/v1
API_BASE_URL=https://pokeapi.co
```

### Construcción de URLs

El framework usa `UrlBuilder` para construir URLs de forma segura:

```typescript
import { UrlBuilder } from '../helpers/urlBuilder';

// Construir URL completa
const url = UrlBuilder.build('/api/v2/pokemon/pikachu');
// → https://pokeapi.co/api/v2/pokemon/pikachu

// Con query params
const url = UrlBuilder.build('/api/v2/pokemon', { limit: 10 });
// → https://pokeapi.co/api/v2/pokemon?limit=10
```

**Ventajas**:
- ✅ URLs nunca hardcodeadas
- ✅ Fácil cambio entre ambientes
- ✅ Validación automática de configuración
- ✅ Construcción segura con query params

### TypeScript

El proyecto usa TypeScript con configuración estricta:
- Target: ES2020
- Module: CommonJS
- Strict mode habilitado
- Resolución de paths configurada

---

## 📈 Reportes

### Visualizar Reportes HTML

```bash
# Iniciar servidor local
npx http-server reports/ -p 8080

# Abrir en navegador
# http://localhost:8080/cucumber-report.html
```

### Archivos de Reporte

- `reports/cucumber-report.html` - Reporte HTML interactivo
- `reports/cucumber-report.json` - Reporte JSON para CI/CD
- `reports/junit.xml` - Reporte JUnit para Jenkins/CI
- `logs/test-execution.log` - Logs detallados de ejecución

---

## 📝 Convenciones de Código

### Nomenclatura

- **Features**: `kebab-case` (ej: `consultar-pokemon.feature`)
- **Classes**: `PascalCase` (ej: `GetPokemon`, `StatusCode`)
- **Variables**: `camelCase` (ej: `pokemonName`, `apiResponse`)
- **Constants**: `UPPER_SNAKE_CASE` (ej: `API_TIMEOUT`)
- **Files**: `camelCase` (ej: `callAnAPI.ts`)

### Estructura de Tests

```typescript
// Task Pattern
export class GetPokemon implements Task {
  static byName(name: string): GetPokemon {
    return new GetPokemon(name);
  }
  
  async performAs(actor: Actor): Promise<void> {
    // implementación
  }
}

// Question Pattern
export class StatusCode implements Question<number> {
  async answeredBy(actor: Actor): Promise<number> {
    // implementación
  }
}
```

---

## 🐛 Troubleshooting

### Problema: Tests fallan con timeout

**Solución**: Aumenta el timeout en `.env`:
```bash
DEFAULT_TIMEOUT=60000
API_TIMEOUT=60000
```

### Problema: No se generan reportes

**Solución**: Verifica que exista el directorio `reports/`:
```bash
npm run clean
npm test
```

### Problema: Errores de TypeScript

**Solución**: Reinstala dependencias:
```bash
rm -rf node_modules
npm install
```

---

## 📞 Soporte

Para más información, consulta:
- [README.md](README.md) - Documentación completa
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - Estado y métricas
- GitHub Issues - Reportar problemas

---

**Última actualización**: 28 de Octubre, 2025  
**Versión del Framework**: 1.0.0
