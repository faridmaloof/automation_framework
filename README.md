# 🥒 Cucumber + Screenplay Pattern Framework

> Framework híbrido de testing automatizado usando **Cucumber BDD**, **Screenplay Pattern** y **Playwright**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.56-green)](https://playwright.dev/)
[![Cucumber](https://img.shields.io/badge/Cucumber-10.0-orange)](https://cucumber.io/)

---

## � Documentación

- **[README.md](README.md)** - Esta guía (inicio rápido)
- **[DOCS.md](DOCS.md)** - Documentación completa y troubleshooting
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Estado del framework y métricas
- **[.env.example](.env.example)** - Plantilla de variables de entorno

---

##  Quick Start

```powershell
# Instalar dependencias
npm install

# Ejecutar smoke tests API
npm run test:api:rest:smoke

# Ejecutar con tags personalizados
npm run test -- --tags "@api and @rest and not @wip"

# Ver reportes
npm run report
```

---

## 🏷️ Ejecución con Tags

```powershell
# Sintaxis: npm run test -- --tags "expresión"

# Tags simples
npm run test -- --tags "@smoke"
npm run test -- --tags "@api"

# Tags combinados con AND
npm run test -- --tags "@api and @rest"
npm run test -- --tags "@api and @rest and @smoke"

# Tags con OR
npm run test -- --tags "@smoke or @regression"

# Tags con NOT (excluir)
npm run test -- --tags "@api and not @wip"
npm run test -- --tags "not @slow and not @flaky"

# Tags complejos
npm run test -- --tags "(@api or @web) and @smoke"
npm run test -- --tags "@priority-high and not @manual"
```

### Tags Disponibles
- `@api` - Tests de API
- `@rest` - API REST
- `@graphql` - API GraphQL
- `@web` - Tests de interfaz web
- `@smoke` - Suite de smoke tests
- `@regression` - Suite de regresión
- `@priority-high` - Tests de alta prioridad
- `@wip` - Work in progress (en desarrollo)
- `@flaky` - Tests con comportamiento inestable

---

## 🌐 Multi-Browser Testing

```powershell
# Browser único (por defecto: chromium)
BROWSER=chromium npm run test:web

# Múltiples browsers (ejecuta en todos secuencialmente)
BROWSER=chromium,firefox,webkit npm run test:web

# O edita .env:
BROWSER=chromium,firefox,webkit
```

Browsers soportados:
- `chromium` - Google Chrome / Chromium
- `firefox` - Mozilla Firefox
- `webkit` - Safari / WebKit
- `edge` - Microsoft Edge (chromium-based)

---

## 📊 Reportes

### Generar Reportes

```powershell
# HTML Report (por defecto)
npm run report

# Timeline Report (visual con duración de tests)
npm run report:timeline

# Allure Report (requiere instalación)
npm install -D allure-commandline
npm run report:allure
```

### Configurar Reportes en .env

```properties
# Activar/desactivar reportes (true/false)
GENERATE_HTML_REPORT=true
GENERATE_JSON_REPORT=true
GENERATE_JUNIT_REPORT=true
GENERATE_ALLURE_REPORT=false
GENERATE_TIMELINE_REPORT=true
GENERATE_CUCUMBER_REPORT=true
```

### Tipos de Reportes

| Reporte | Archivo | Descripción |
|---------|---------|-------------|
| **HTML** | `reports/cucumber-report.html` | Reporte visual con detalles de ejecución |
| **JSON** | `reports/cucumber-report.json` | Datos en formato JSON para integración |
| **JUnit** | `reports/junit.xml` | Compatible con Jenkins, CI/CD |
| **Allure** | `reports/allure-report/` | Reporte avanzado con gráficos y métricas |
| **Timeline** | `reports/timeline-report.html` | Visualización de duración de tests |

### Ejemplo de Workflow con Reportes

```powershell
# 1. Ejecutar tests
npm run test:smoke

# 2. Generar reporte HTML (automático)
npm run report

# 3. Generar timeline
npm run report:timeline

# 4. (Opcional) Generar Allure
# Primero: GENERATE_ALLURE_REPORT=true en .env
npm run report:allure
```

---

## 📁 Estructura del Proyecto

```
automation/
│
├── features/                   # Features por FUNCIONALIDAD
│   └── pokemon/
│       └── consultar-pokemon.feature
│
├── steps/                      # Step definitions
│   └── common.steps.ts
│
├── src/                        # Screenplay Pattern
│   ├── actors/
│   ├── abilities/
│   ├── tasks/
│   └── questions/
│
├── support/                    # Hooks y World
│   ├── world.ts
│   └── hooks.ts
│
└── cucumber.json              # Configuración
```

---

## 🎭 Screenplay Pattern

```typescript
// Crear actor con habilidad
const actor = Actor.named('APITester')
  .can(CallAnAPI.using(apiContext));

// Ejecutar tarea
await actor.attemptsTo(new GetPokemon('pikachu'));

// Validar con pregunta
await actor.asks(StatusCode.of(response).toBe(200));
```

---

## 🏷️ Ejecución por Tags

```powershell
# Smoke tests
npm run test:smoke

# API tests
npm run test:api:rest

# Con tags personalizados
npx cucumber-js --tags "@smoke and @api"
```

---

## 📊 Resultados Actuales

- ✅ **7/7 scenarios PASSED** (100%)
- ✅ **33/33 steps PASSED**
- ⚡ **85-395ms response times**

---

## 📚 Documentación

- **[README_CUCUMBER.md](./README_CUCUMBER.md)** - Guía completa de uso
- **[CUCUMBER_MIGRATION_SUMMARY.md](./CUCUMBER_MIGRATION_SUMMARY.md)** - Estado de migración

---

**Happy Testing! 🚀**
