# 🥒 Cucumber + Screenplay Pattern Framework

> Framework híbrido de testing automatizado usando **Cucumber BDD**, **Screenplay Pattern** y **Playwright**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.56-green)](https://playwright.dev/)
[![Cucumber](https://img.shields.io/badge/Cucumber-10.0-orange)](https://cucumber.io/)

---

## 🚀 Quick Start

```powershell
# Instalar dependencias
npm install

# Ejecutar smoke tests API
npm run test:api:rest:smoke

# Ejecutar todos los tests API
npm run test:api

# Ver reportes
npm run report
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
