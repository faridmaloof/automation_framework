# 🎭 Playwright Super-Framework

> **Framework de Automatización Integral con Orquestación Multi-Equipo**  
> Playwright + TypeScript + Cucumber + BDD + Screenplay Pattern

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.56-green)](https://playwright.dev/)
[![Cucumber](https://img.shields.io/badge/Cucumber-12.2-orange)](https://cucumber.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Tabla de Contenidos

- [Visión General](#visión-general)
- [Características Principales](#características-principales)
- [Requisitos Previos](#requisitos-previos)
- [Instalación Rápida](#instalación-rápida)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Guía de Uso](#guía-de-uso)
- [Patrones Implementados](#patrones-implementados)
- [Sistema de Orquestación](#sistema-de-orquestación)
- [Documentación](#documentación)
- [Contribución](#contribución)

---

## 🎯 Visión General

Este super-framework está diseñado para ser la **solución definitiva** de automatización de pruebas que puede funcionar en dos modos:

### **Modo 1: Framework Standalone** 🏢
Cada equipo puede clonar este framework y desarrollar sus pruebas de forma independiente.

### **Modo 2: Orquestador Central** 🎼
Un proyecto centralizador que puede ejecutar pruebas de múltiples equipos usando **Git Submodules**, agregando resultados y generando reportes consolidados.

---

## ✨ Características Principales

### 🌐 Multi-Plataforma
- ✅ **Web Testing**: Chromium, Firefox, WebKit
- ✅ **API Testing**: REST, GraphQL, Contract Testing
- ✅ **Mobile Testing**: Preparado para Appium (futuro)
- ✅ **Database Testing**: PostgreSQL, MySQL, MongoDB, SQL Server

### 🎨 Patrones de Diseño Avanzados
- ✅ **Fixture Pattern**: Setup/teardown automático
- ✅ **Page Object Model (POM)**: Encapsulación de UI
- ✅ **Screenplay Pattern**: Workflows de negocio complejos
- ✅ **BDD con Cucumber**: Documentación viva en Gherkin
- ✅ **Data-Driven Testing**: Tests parametrizados

### 🔐 Seguridad y Secretos
- ✅ Gestión multi-cloud (AWS, Azure, GCP)
- ✅ Integración con Secret Managers
- ✅ Variables de ambiente por entorno

### 📊 Reporting Avanzado
- ✅ **Allure Report**: Reportes visuales ricos
- ✅ **Xray/Jira**: Trazabilidad completa
- ✅ **Multiple Cucumber HTML Reporter**
- ✅ Notificaciones (Slack, Teams, Email)

### 🎼 Orquestación Multi-Equipo
- ✅ Git Submodules para gestión de equipos
- ✅ Ejecución paralela de múltiples proyectos
- ✅ Agregación de resultados
- ✅ Resolución de dependencias

### 🚀 CI/CD Ready
- ✅ Pipelines preconfigurados
- ✅ Jenkins, GitHub Actions, Azure DevOps
- ✅ Ejecución programada
- ✅ Matrix strategy para navegadores

---

## 📦 Requisitos Previos

```bash
Node.js >= 18.0.0
npm >= 9.0.0
Git >= 2.30.0
```

**Opcional para Orquestación:**
```bash
PowerShell >= 7.0 (para scripts de orquestación)
```

---

## 🚀 Instalación Rápida

### 1. Clonar el Repositorio

```powershell
git clone https://github.com/your-org/playwright-super-framework.git
cd playwright-super-framework
```

### 2. Instalar Dependencias

```powershell
npm install
```

### 3. Instalar Navegadores de Playwright

```powershell
npx playwright install --with-deps
```

### 4. Configurar Variables de Ambiente

```powershell
# Copiar el archivo de ejemplo
Copy-Item .env.example .env

# Editar .env con tus valores
notepad .env
```

### 5. Ejecutar Tests de Ejemplo

```powershell
# Ejecutar todos los tests
npm test

# Ejecutar con UI Mode
npm run test:ui

# Ejecutar solo tests de API
npm run test:api

# Ejecutar con Cucumber
npm run cucumber
```

---

## 📁 Estructura del Proyecto

```
playwright-super-framework/
├── 📋 config/                      # Configuraciones por ambiente
│   ├── environments.ts             # dev, qa, staging, prod
│   ├── browsers.config.ts
│   └── database.config.ts
│
├── 💎 src/
│   ├── core/                       # Núcleo del framework
│   │   ├── fixtures/               # Custom fixtures
│   │   ├── helpers/                # Utilidades
│   │   ├── database/               # Clientes DB
│   │   ├── api/                    # Cliente API
│   │   └── secrets/                # Gestión de secretos
│   │
│   ├── pages/                      # Page Object Model
│   │   ├── components/             # Componentes reutilizables
│   │   └── *.page.ts
│   │
│   ├── actors/                     # Screenplay Pattern
│   ├── abilities/                  # Habilidades de actores
│   ├── tasks/                      # Tareas de alto nivel
│   ├── interactions/               # Interacciones atómicas
│   │
│   ├── steps/                      # Step Definitions (Cucumber)
│   ├── api/                        # API Testing
│   │   ├── services/
│   │   ├── schemas/
│   │   └── validators/
│   │
│   └── integrations/               # Integraciones
│       ├── xray/
│       └── slack/
│
├── 🎭 features/                    # Archivos .feature (Gherkin)
│   ├── authentication/
│   ├── api/
│   └── e2e/
│
├── 📊 data/                        # Test Data
│   ├── json/
│   ├── csv/
│   ├── sql/
│   └── fixtures/
│
├── 🧪 tests/                       # Playwright Tests
│   ├── web/
│   ├── api/
│   └── e2e/
│
├── 🎼 orchestrator/                # Sistema de Orquestación
│   ├── src/
│   │   ├── managers/               # SubmoduleManager
│   │   ├── discovery/              # ProjectDiscovery
│   │   ├── execution/              # SuiteOrchestrator
│   │   └── aggregation/            # ResultAggregator
│   ├── config/
│   └── cli.ts
│
├── 📁 team-projects/               # Git Submodules
│   ├── team-a/                     # @submodule
│   ├── team-b/                     # @submodule
│   └── team-c/                     # @submodule
│
├── 📜 scripts/                     # Scripts de utilidad
│   ├── init-submodules.ps1
│   ├── update-all-teams.ps1
│   └── execute-teams.ps1
│
└── 📚 docs/                        # Documentación
    ├── architecture/
    ├── patterns/
    ├── guides/
    └── api/
```

---

## 📖 Guía de Uso

### Escribir tu Primera Prueba

#### Con Playwright (TypeScript)

```typescript
// tests/web/smoke/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/loginPage';

test.describe('Login Tests', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigate();
    await loginPage.login('user@example.com', 'password123');
    
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
```

#### Con Cucumber (BDD)

```gherkin
# features/authentication/login.feature
@smoke @authentication
Feature: User Authentication
  As a registered user
  I want to log into the application
  So that I can access my account

  Scenario: Successful login with valid credentials
    Given the user is on the login page
    When the user enters email "user@example.com"
    And the user enters password "password123"
    And clicks the login button
    Then the user should be redirected to the dashboard
    And see a welcome message "Welcome back!"
```

```typescript
// src/steps/loginSteps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '@pages/loginPage';

Given('the user is on the login page', async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.navigate();
});

When('the user enters email {string}', async function (email: string) {
  await this.loginPage.fillEmail(email);
});
```

### Tests de API

```typescript
// tests/api/contract/userApi.spec.ts
import { test, expect } from '@playwright/test';
import { UserService } from '@api/services/userService';

test.describe('User API Contract Tests', () => {
  let userService: UserService;

  test.beforeAll(async ({ request }) => {
    userService = new UserService(request);
  });

  test('should get user details', async () => {
    const response = await userService.getUser('123');
    
    expect(response.status).toBe(200);
    expect(response.responseTime).toBeLessThan(500);
    
    const user = await response.json();
    expect(user).toHaveProperty('id', '123');
    expect(user).toHaveProperty('email');
  });
});
```

---

## 🎨 Patrones Implementados

### 1. Page Object Model (POM)

```typescript
// src/pages/loginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  private selectors = {
    emailInput: '#email',
    passwordInput: '#password',
    loginButton: 'button[type="submit"]',
  };

  async navigate(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.fill(this.selectors.emailInput, email);
    await this.page.fill(this.selectors.passwordInput, password);
    await this.page.click(this.selectors.loginButton);
  }
}
```

### 2. Screenplay Pattern

```typescript
// src/tasks/authentication/login.task.ts
export class Login implements Task {
  constructor(
    private email: string,
    private password: string
  ) {}

  async performAs(actor: Actor): Promise<void> {
    const browser = actor.abilityTo(BrowseTheWeb);
    await browser.goto('/login');
    await browser.fill('#email', this.email);
    await browser.fill('#password', this.password);
    await browser.click('button[type="submit"]');
  }
}

// Uso
await actor.attemptsTo(
  new Login('user@example.com', 'password123')
);
```

---

## 🎼 Sistema de Orquestación

### Configurar Submodules

```powershell
# Inicializar todos los submodules
npm run orchestrator:init

# O manualmente
git submodule add https://github.com/org/team-a-tests.git team-projects/team-a
git submodule add https://github.com/org/team-b-tests.git team-projects/team-b
```

### Configurar Equipos a Ejecutar

```typescript
// orchestrator/config/orchestration.config.ts
export const orchestrationConfig = {
  teams: [
    {
      name: 'team-authentication',
      path: 'team-projects/team-authentication',
      enabled: true,
      tags: ['@smoke', '@critical'],
    },
    {
      name: 'team-payments',
      path: 'team-projects/team-payments',
      enabled: true,
      depends: ['team-authentication'],
    },
  ],
  execution: {
    parallel: true,
    maxWorkers: 4,
    retries: 1,
  },
};
```

### Ejecutar Orquestación

```powershell
# Actualizar todos los equipos
npm run orchestrator:update

# Ejecutar tests de equipos específicos
npm run orchestrator:cli -- --teams team-a,team-b

# Ejecutar todos
npm run orchestrator:execute
```

---

## 📊 Comandos Disponibles

### Tests

```powershell
npm test                    # Ejecutar todos los tests
npm run test:headed         # Ejecutar con navegador visible
npm run test:ui             # Abrir UI Mode
npm run test:debug          # Modo debug
npm run test:web            # Solo tests web
npm run test:api            # Solo tests API
npm run test:e2e            # Solo tests e2e
npm run test:smoke          # Tests con @smoke tag
npm run test:regression     # Tests con @regression tag
```

### Cucumber

```powershell
npm run cucumber            # Ejecutar todas las features
npm run cucumber:dev        # Ejecutar sin paralel
npm run cucumber:tags -- "@smoke"  # Por tags
```

### Reportes

```powershell
npm run allure:generate     # Generar reporte Allure
npm run allure:open         # Abrir reporte generado
npm run allure:serve        # Generar y servir
npm run report:html         # Abrir reporte Playwright
```

### Orquestación

```powershell
npm run orchestrator:init   # Inicializar submodules
npm run orchestrator:update # Actualizar equipos
npm run orchestrator:execute # Ejecutar equipos
npm run orchestrator:cli    # CLI interactivo
```

### Base de Datos

```powershell
npm run db:seed             # Seed datos de prueba
npm run db:cleanup          # Limpiar BD
```

### Integración

```powershell
npm run xray:publish        # Publicar resultados a Xray
```

### Calidad de Código

```powershell
npm run lint                # Ejecutar ESLint
npm run lint:fix            # Fix automático
npm run format              # Formatear con Prettier
npm run format:check        # Verificar formato
npm run type-check          # Verificar tipos TypeScript
npm run clean               # Limpiar reportes
```

---

## 🌍 Configuración por Ambiente

```powershell
# Desarrollo
ENV=dev npm test

# QA
ENV=qa npm test

# Staging
ENV=staging npm test

# Producción (cuidado!)
ENV=prod npm test
```

---

## 📚 Documentación

- 📖 [**Plan de Implementación**](IMPLEMENTATION_PLAN.md) - Roadmap completo
- 🏗️ [**Arquitectura del Sistema**](docs/architecture/system-design.md)
- 🎨 [**Guía de Patrones**](docs/patterns/)
- 📝 [**Getting Started**](docs/guides/getting-started.md)
- 🤝 [**Guía de Contribución**](CONTRIBUTING.md)
- 🔧 [**API Reference**](docs/api/)

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor lee nuestra [Guía de Contribución](CONTRIBUTING.md).

### Proceso de Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

## 📞 Soporte

- 📧 Email: qa-automation@yourcompany.com
- 💬 Slack: #qa-automation-framework
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/playwright-super-framework/issues)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- [Playwright Team](https://playwright.dev/)
- [Cucumber Team](https://cucumber.io/)
- [TypeScript Team](https://www.typescriptlang.org/)
- Comunidad de QA Automation

---

## 🚀 Estado del Proyecto

```
✅ Fase 1: Fundación - COMPLETADO
🔄 Fase 2: Core Framework - EN PROGRESO
⏳ Fase 3: Patrones de Diseño - PENDIENTE
⏳ Fase 4: Sistema de Orquestación - PENDIENTE
⏳ Fase 5: Reporting - PENDIENTE
⏳ Fase 6: CI/CD - PENDIENTE
```

---

<div align="center">

**Hecho con ❤️ por el equipo de QA Engineering**

[⬆ Volver arriba](#-playwright-super-framework)

</div>
