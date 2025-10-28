# 🥒 Cucumber + Screenplay Pattern Framework

> Framework híbrido de testing (API + Web + Mobile) usando Cucumber BDD y Screenplay Pattern

---

## 🚀 Quick Start

```powershell
# Instalar dependencias (si es necesario)
npm install

# Ejecutar smoke tests API
npm run test:api:rest:smoke

# Ver resultados
npm run report
```

---

## 📁 Estructura del Proyecto

```
automation/
│
├── features/                      # Features por FUNCIONALIDAD (no por tipo)
│   └── pokemon/
│       └── consultar-pokemon.feature
│
├── steps/                         # Step definitions genéricos
│   └── common.steps.ts
│
├── src/
│   ├── actors/                    # Actores del Screenplay Pattern
│   │   └── actor.ts
│   │
│   ├── abilities/                 # Habilidades que los actores pueden tener
│   │   ├── callAnAPI.ts          # Hacer requests HTTP
│   │   ├── browseTheWeb.ts       # Navegar en browser
│   │   └── accessDatabase.ts     # Acceder a DB
│   │
│   ├── tasks/                     # Acciones de negocio (por tipo)
│   │   └── api/rest/
│   │       └── GetPokemon.ts
│   │
│   └── questions/                 # Validaciones (por tipo)
│       └── api/
│           ├── StatusCode.ts
│           ├── FieldValue.ts
│           ├── HasField.ts
│           ├── ResponseTime.ts
│           └── SchemaValidation.ts
│
├── support/                       # Configuración Cucumber
│   ├── world.ts                  # CustomWorld con Actor
│   └── hooks.ts                  # Before/After hooks inteligentes
│
└── cucumber.json                  # Configuración Cucumber
```

---

## 🎭 Screenplay Pattern

### **Conceptos Principales**

1. **Actor** - Quien ejecuta las acciones
2. **Abilities** - Capacidades del actor (API, Web, DB)
3. **Tasks** - Acciones de negocio de alto nivel
4. **Questions** - Validaciones y verificaciones

### **Ejemplo de Uso**

```typescript
// Crear actor con habilidad API
const actor = Actor.named('APITester')
  .can(CallAnAPI.using(apiContext));

// Ejecutar tarea
await actor.attemptsTo(new GetPokemon('pikachu'));

// Hacer pregunta (validación)
const isOk = await actor.asks(StatusCode.of(response).toBe(200));
```

---

## 🏷️ Sistema de Tags

### **Tags por Funcionalidad**
- `@pokemon` - Features de Pokémon
- `@usuarios` - Features de usuarios
- `@busqueda` - Features de búsqueda

### **Tags por Tipo de Test**
- `@api` - Tests de API
- `@web` - Tests Web
- `@mobile` - Tests Mobile

### **Tags por Tecnología**
- `@rest` - REST API
- `@graphql` - GraphQL API
- `@soap` - SOAP API
- `@chrome` - Browser Chrome
- `@firefox` - Browser Firefox
- `@android` - Android device
- `@ios` - iOS device

### **Tags por Criticidad**
- `@smoke` - Tests críticos rápidos
- `@regression` - Suite completa
- `@validation` - Validaciones especiales
- `@negative` - Casos negativos

---

## 🎯 Comandos de Ejecución

### **Por Criticidad**
```powershell
npm run test:smoke              # Solo smoke tests
npm run test:regression         # Regresión completa
```

### **Por Tipo de Test**
```powershell
npm run test:api                # Todos los API
npm run test:api:rest           # Solo REST
npm run test:api:graphql        # Solo GraphQL
npm run test:web                # Todos Web
npm run test:mobile             # Todos Mobile
```

### **Por Navegador**
```powershell
npm run test:web:chrome         # Chrome
npm run test:web:firefox        # Firefox
npm run test:web:safari         # Safari/WebKit
```

### **Combinaciones**
```powershell
# Solo smoke tests de API REST
npx cucumber-js --tags "@smoke and @api and @rest"

# Regresión Web en Chrome
npx cucumber-js --tags "@regression and @web and @chrome"

# Todo excepto Web
npx cucumber-js --tags "not @web"
```

### **Parallel + CI/CD**
```powershell
npm run test:parallel           # 4 workers
npm run test:ci                 # Para CI/CD (genera JSON)
```

---

## 📝 Crear Nuevos Tests

### **1. Crear Feature**

```gherkin
# features/usuarios/login.feature
@usuarios @login
Feature: Login de usuario
  Como usuario del sistema
  Quiero poder hacer login
  Para acceder a mi cuenta

  @smoke @api @rest
  Scenario: Login exitoso con credenciales válidas
    Given el sistema está disponible
    When hago login con usuario "admin" y password "123456"
    Then obtengo respuesta exitosa
    And recibo un token de autenticación válido

  @negative @api @rest
  Scenario: Login fallido con credenciales inválidas
    Given el sistema está disponible
    When hago login con usuario "admin" y password "wrongpass"
    Then obtengo respuesta con status 401
```

### **2. Crear Task**

```typescript
// src/tasks/api/rest/Login.ts
import { Task } from '../../../tasks/task';
import { Actor } from '../../../actors/actor';
import { CallAnAPI } from '../../../abilities/callAnAPI';
import { APIResponse } from '@playwright/test';

export class Login implements Task {
  private response?: APIResponse;
  private body?: any;

  constructor(
    private username: string,
    private password: string
  ) {}

  async performAs(actor: Actor): Promise<void> {
    console.log(`🔐 Logging in as: ${this.username}`);
    
    const apiAbility = actor.abilityTo(CallAnAPI);
    const responseWithEvidence = await apiAbility.post('/auth/login', {
      data: {
        username: this.username,
        password: this.password
      }
    });

    this.response = responseWithEvidence.response;
    this.body = await this.response.json();
  }

  getResponse(): APIResponse | undefined {
    return this.response;
  }

  getBody(): any {
    return this.body;
  }
}
```

### **3. Crear Question**

```typescript
// src/questions/api/HasValidToken.ts
import { Question } from '../question';
import { Actor } from '../../actors/actor';

export class HasValidToken implements Question<boolean> {
  private token?: string;

  constructor(token: string | undefined) {
    this.token = token;
  }

  static in(body: any): HasValidToken {
    return new HasValidToken(body?.token);
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    if (!this.token) {
      console.log('❌ No token found');
      return false;
    }

    // Validar formato JWT
    const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    const isValid = jwtPattern.test(this.token);
    
    console.log(isValid ? '✅ Valid token' : '❌ Invalid token format');
    return isValid;
  }
}
```

### **4. Crear Steps**

```typescript
// steps/auth.steps.ts (nuevo archivo)
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { Login } from '../src/tasks/api/rest/Login';
import { StatusCode } from '../src/questions/api/StatusCode';
import { HasValidToken } from '../src/questions/api/HasValidToken';

When('hago login con usuario {string} y password {string}',
  async function (this: CustomWorld, username: string, password: string) {
    const task = new Login(username, password);
    await this.actor.attemptsTo(task);
    
    this.lastResponse = task.getResponse();
    this.lastBody = task.getBody();
  }
);

Then('recibo un token de autenticación válido',
  async function (this: CustomWorld) {
    const question = HasValidToken.in(this.lastBody);
    const result = await this.actor.asks(question);
    
    if (!result) {
      throw new Error('Expected valid JWT token');
    }
  }
);
```

---

## 🔍 Questions Disponibles

### **StatusCode** - Validar código HTTP
```typescript
await actor.asks(StatusCode.of(response).toBe(200));
await actor.asks(StatusCode.of(response).toBe(404));
```

### **FieldValue** - Validar valores de campos
```typescript
// Simple
await actor.asks(FieldValue.of(body, 'name').toBe('pikachu'));

// Nested paths
await actor.asks(FieldValue.of(body, 'user.profile.email').toBe('test@example.com'));

// Números
await actor.asks(FieldValue.of(body, 'id').toBeNumber(25));
```

### **HasField** - Verificar existencia
```typescript
await actor.asks(HasField.of(body, 'abilities'));
await actor.asks(HasField.of(body, 'user.settings'));
```

### **ResponseTime** - Performance
```typescript
await actor.asks(ResponseTime.of(responseTime).lessThan(2000));
await actor.asks(ResponseTime.of(responseTime).lessThan(500));
```

### **SchemaValidation** - JSON Schema
```typescript
const schema = {
  type: 'object',
  required: ['id', 'name'],
  properties: {
    id: { type: 'number' },
    name: { type: 'string' }
  }
};

await actor.asks(SchemaValidation.of(body).matchesSchema(schema));
```

---

## 🎨 Hooks Inteligentes

Los hooks detectan automáticamente el tipo de test por tags:

### **Setup Automático por Tags**

```typescript
// Scenario con @api → Crea APIRequestContext
@api @rest
Scenario: Test API
  # Automáticamente: actor.can(CallAnAPI.using(apiContext))

// Scenario con @web → Lanza browser
@web @chrome
Scenario: Test Web
  # Automáticamente: browser = chromium, actor.can(BrowseTheWeb.using(page))

// Scenario con @mobile → Setup Appium
@mobile @android
Scenario: Test Mobile
  # Automáticamente: configura Appium
```

### **Cleanup Automático**

- Cierra contextos API
- Cierra browsers
- Toma screenshots en fallos
- Genera evidencias

---

## 📊 Reportes

### **Formatos Disponibles**

1. **HTML** - `reports/cucumber-report.html`
2. **JSON** - `reports/cucumber-report.json`
3. **JUnit** - `reports/cucumber-report.xml`
4. **Console** - Progress bar + Summary

### **Abrir Reporte**

```powershell
npm run report
# Abre reports/cucumber-report.html en el navegador
```

---

## 🔧 Configuración

### **cucumber.json**

```json
{
  "require": [
    "steps/**/*.steps.ts",
    "support/**/*.ts"
  ],
  "paths": ["features/**/*.feature"],
  "requireModule": ["ts-node/register"],
  "format": [
    "html:reports/cucumber-report.html",
    "json:reports/cucumber-report.json",
    "junit:reports/cucumber-report.xml",
    "summary",
    "progress-bar"
  ],
  "parallel": 2,
  "retry": 1
}
```

### **Variables de Entorno**

```powershell
# Base URL de la API
$env:BASE_URL = "https://pokeapi.co"

# Browser (chromium, firefox, webkit)
$env:BROWSER = "chromium"

# Headless mode
$env:HEADLESS = "true"
```

---

## 🧪 Testing Best Practices

### **1. Organización de Features**

✅ **CORRECTO** - Por funcionalidad:
```
features/
  pokemon/consultar-pokemon.feature
  usuarios/login.feature
  busqueda/filtros.feature
```

❌ **INCORRECTO** - Por tipo de test:
```
features/
  api/pokemon.feature
  web/pokemon.feature
  mobile/pokemon.feature
```

### **2. Uso de Tags**

✅ **CORRECTO** - Múltiples dimensiones:
```gherkin
@usuarios @login @smoke @api @rest
Scenario: Login exitoso
```

### **3. Steps Reutilizables**

✅ **CORRECTO** - Genéricos:
```gherkin
When consulto el pokemon "pikachu" por REST
Then obtengo respuesta exitosa
```

❌ **INCORRECTO** - Muy específicos:
```gherkin
When hago GET a "/api/v2/pokemon/pikachu" con header "Accept: application/json"
Then el status code es 200 y el body contiene "pikachu"
```

### **4. Questions vs Assertions**

✅ **CORRECTO** - Usar Questions:
```typescript
const isValid = await actor.asks(StatusCode.of(response).toBe(200));
if (!isValid) throw new Error('Status code not 200');
```

❌ **INCORRECTO** - Assertions directas:
```typescript
expect(response.status()).toBe(200);
```

---

## 🐛 Troubleshooting

### **Error: Undefined steps**

**Problema**: Steps no se encuentran

**Solución**:
1. Verificar que `steps/**/*.steps.ts` esté en `cucumber.json`
2. Revisar sintaxis del step (espacios, parámetros)
3. Reiniciar terminal

### **Error: Module not found**

**Problema**: Imports incorrectos

**Solución**:
1. Verificar rutas relativas (`../`, `../../`)
2. Usar lowercase en nombres de archivos
3. Revisar exports/imports

### **Error: Tags no funcionan en PowerShell**

**Problema**: PowerShell interpreta `@` como variable

**Solución**:
```powershell
# ✅ Usar comillas dobles
npx cucumber-js --tags "@smoke and @api"

# ❌ No usar comillas simples
npx cucumber-js --tags '@smoke and @api'
```

---

## 📚 Recursos

- [Cucumber Docs](https://cucumber.io/docs/cucumber/)
- [Playwright Docs](https://playwright.dev)
- [Screenplay Pattern](https://serenity-js.org/handbook/design/screenplay-pattern.html)
- [Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)

---

## 🤝 Contribuir

### **Agregar nueva funcionalidad**

1. Crear feature en `features/{funcionalidad}/`
2. Crear tasks en `src/tasks/{tipo}/`
3. Crear questions si es necesario
4. Crear steps en `steps/`
5. Documentar en este README

### **Convenciones**

- Features: Gherkin en español
- Código: TypeScript con tipos
- Nombres: PascalCase para clases, camelCase para variables
- Comments: Emojis para logs (✅ ❌ 🔍 📊 🎬)

---

## 📞 Contacto

Para dudas o sugerencias sobre el framework, revisar:
- `CUCUMBER_MIGRATION_SUMMARY.md` - Estado actual completo
- `project_requirement.md` - Requerimientos originales

---

**Happy Testing! 🚀**
