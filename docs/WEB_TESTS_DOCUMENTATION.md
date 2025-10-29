# Pruebas Web - Documentación PokeAPI

Este documento describe las pruebas automatizadas para la documentación de PokeAPI (https://pokeapi.co/docs).

## 📋 Índice

- [Descripción General](#descripción-general)
- [Arquitectura](#arquitectura)
- [Escenarios de Prueba](#escenarios-de-prueba)
- [Ejecución](#ejecución)
- [Estructura del Código](#estructura-del-código)
- [Agregar Nuevas Pruebas](#agregar-nuevas-pruebas)

## 🎯 Descripción General

Las pruebas de documentación validan:
- ✅ Navegación principal (API v1, API v2, GraphQL)
- ✅ Mensajes de deprecación (API v1)
- ✅ Contenido de documentación (GraphQL, API v2)
- ✅ Validación de enlaces
- ✅ Diseño responsive (móvil, tablet, escritorio)

## 🏗️ Arquitectura

Las pruebas utilizan el **Patrón Screenplay** con la siguiente estructura en capas:

```
Feature (Gherkin) ──────> Step Definitions
                              │
                              ├──> Tasks (Acciones del Actor)
                              │    ├─ NavigateToPokeAPIDocs
                              │    ├─ ClickLink
                              │    └─ ChangeViewport
                              │
                              └──> Questions (Aserciones)
                                   ├─ SeeHeading
                                   ├─ SeeLink
                                   ├─ SeeText
                                   ├─ SeeDeprecationMessage
                                   ├─ SeeGraphQLTitle
                                   └─ LinksAreClickable
                                   
Page Object (PokeAPIDocsPage) <── Usado por Tasks y Questions
```

### Capas de la Arquitectura

#### 1. **Feature Layer** - `features/pokeapi-docs/`
Archivos `.feature` en Gherkin que definen los escenarios de negocio:

```gherkin
#language: es
@web
Característica: Navegación en la documentación de PokeAPI
  
  Escenario: Verificar estructura principal
    Dado que estoy en la página de documentación de PokeAPI
    Entonces debo ver el encabezado "Docs"
```

#### 2. **Step Definitions** - `steps/pokeapi-docs.steps.ts`
Código que conecta Gherkin con Tasks y Questions:

```typescript
Given('que estoy en la página de documentación de PokeAPI', async function() {
  await this.actor.attemptsTo(new NavigateToPokeAPIDocs());
});
```

#### 3. **Task Layer** - `src/tasks/web/docs/`
Acciones que el Actor puede realizar:

```typescript
export class NavigateToPokeAPIDocs implements Task {
  async performAs(actor: Actor): Promise<void> {
    const page = BrowseTheWeb.from(actor);
    const docsPage = new PokeAPIDocsPage(page);
    await docsPage.navigateToDocsPage();
  }
}
```

**Tasks Disponibles:**
- `NavigateToPokeAPIDocs` - Navegar a la página de docs
- `ClickLink` - Hacer clic en un enlace de navegación
- `ChangeViewport` - Cambiar tamaño del viewport (responsive)

#### 4. **Question Layer** - `src/questions/web/docs/`
Preguntas que el Actor puede hacer para verificar el estado:

```typescript
export class SeeHeading implements Question<boolean> {
  async answeredBy(actor: Actor): Promise<boolean> {
    const docsPage = (actor as any)._docsPage;
    return await docsPage.isDocsHeadingVisible();
  }
}
```

**Questions Disponibles:**
- `SeeHeading` - Verificar encabezado
- `SeeLink` - Verificar enlace
- `SeeText` - Verificar texto genérico
- `SeeDeprecationMessage` - Ver mensaje de deprecación (API v1)
- `SeeDeprecationDate` - Ver fecha de deprecación (API v1)
- `SeeGraphQLTitle` - Ver título de GraphQL
- `SeeGraphQLEndpoint` - Ver endpoint de GraphQL
- `SeeGraphiQLSection` - Ver sección GraphiQL
- `SeeFairUseTitle` - Ver título Fair Use Policy (API v2)
- `SeeResourceSections` - Ver secciones de recursos (API v2)
- `SeeEndpointExamples` - Ver ejemplos de endpoints (API v2)
- `LinksAreClickable` - Verificar enlaces clickeables
- `LinksHaveValidURLs` - Verificar URLs válidas
- `NavigationIsAccessible` - Navegación accesible (responsive)
- `ContentIsReadable` - Contenido legible (responsive)

#### 5. **Page Object Layer** - `src/pages/web/`
Encapsula interacciones con elementos de la UI:

```typescript
export class PokeAPIDocsPage {
  private readonly selectors = {
    docsHeading: 'h1:has-text("Docs")',
    apiV1Link: 'a:has-text("API v1")',
    // ... más selectores
  };
  
  async navigateToDocsPage(): Promise<void> { ... }
  async clickNavigationLink(linkText: string): Promise<void> { ... }
  async isDocsHeadingVisible(): Promise<boolean> { ... }
}
```

**Características del Page Object:**
- ✅ 15+ selectores para elementos de la página
- ✅ 20+ métodos para interacciones y verificaciones
- ✅ Estrategias múltiples de búsqueda de elementos
- ✅ Timeouts configurables y manejo de errores
- ✅ Soporte para responsive (3 tamaños de viewport)

## 📝 Escenarios de Prueba

### 1. Verificar Estructura Principal (@smoke)
**Objetivo:** Validar que la página principal de docs tiene los enlaces de navegación esperados

**Steps:**
1. Navegar a `/docs`
2. Verificar encabezado "Docs"
3. Verificar enlaces: API v1, API v2, GraphQL v1beta

**Selectores clave:**
- Encabezado: `h1:has-text("Docs"), h2:has-text("Docs")`
- Enlaces: `a:has-text("API v1")`, etc.

---

### 2. Navegación a API v1 - Deprecación
**Objetivo:** Verificar mensaje de deprecación cuando se accede a API v1

**Steps:**
1. Hacer clic en "API v1"
2. Verificar mensaje "End of support for version 1"
3. Verificar fecha "After 15 October 2018"

**Selectores clave:**
- Mensaje: `text=/End of support for version 1/i`
- Fecha: `text=/After 15 October 2018/i`

---

### 3. Navegación a GraphQL
**Objetivo:** Validar que la documentación de GraphQL muestra información correcta

**Steps:**
1. Hacer clic en "GraphQL v1beta"
2. Verificar título de GraphQL
3. Verificar endpoint "graphql.pokeapi.co/v1beta"
4. Verificar sección "GraphiQL"

**Selectores clave:**
- Título: `h1:has-text("GraphQL"), h2:has-text("GraphQL")`
- Endpoint: `text=/graphql.pokeapi.co/i`
- GraphiQL: `text=/GraphiQL/i`

---

### 4. Navegación a API v2
**Objetivo:** Verificar contenido de la documentación actual (API v2)

**Steps:**
1. Hacer clic en "API v2"
2. Verificar título "Fair Use Policy"
3. Verificar secciones de recursos
4. Verificar ejemplos de endpoints

**Selectores clave:**
- Fair Use: `text=/Fair Use Policy/i`
- Recursos: `text=/Resources/i`
- Ejemplos: `code`, `pre`

---

### 5. Validación de Enlaces (@smoke @regression)
**Objetivo:** Verificar que todos los enlaces están funcionales

**Validaciones:**
1. Todos los enlaces principales son clickeables
2. Todos los enlaces tienen URLs válidas (href no vacío)

**Métodos del Page Object:**
- `areAllMainLinksClickable()`
- `doAllMainLinksHaveValidURLs()`

---

### 6. Diseño Responsive (Scenario Outline)
**Objetivo:** Verificar que la navegación funciona en diferentes dispositivos

**Dispositivos:**
- 📱 Móvil: 375x667 (iPhone SE)
- 📱 Tablet: 768x1024 (iPad)
- 🖥️ Escritorio: 1920x1080

**Validaciones:**
1. Navegación accesible en cada tamaño
2. Contenido legible en cada tamaño

**Métodos del Page Object:**
- `changeViewportSize(deviceType)`
- `isNavigationAccessible()`
- `isContentReadable()`

---

## 🚀 Ejecución

### Ejecutar todas las pruebas web de documentación

```bash
# Modo headless (por defecto)
npm run test:web:docs

# Modo headed (ver el navegador)
npm run test:web:docs:headed

# Solo escenarios con @smoke
npm run test:web:smoke
```

### Ejecutar todos los tests web

```bash
# Todas las pruebas web
npm run test:web

# Solo smoke tests web
npm run test:web:smoke

# Chrome específicamente
npm run test:web:chrome

# Firefox específicamente
npm run test:web:firefox

# Safari (WebKit) específicamente
npm run test:web:safari

# Todos los navegadores
npm run test:web:all
```

### Ejecución con opciones

```bash
# Ejecutar escenario específico
npx cucumber-js features/pokeapi-docs/navegacion-documentacion.feature --name "Verificar estructura"

# Ejecutar con tags específicos
npx cucumber-js --tags "@web and @smoke"

# Modo debug (sin paralelización)
npm run test:debug -- --tags "@web"
```

## 📁 Estructura del Código

```
automation/
├── features/
│   └── pokeapi-docs/
│       └── navegacion-documentacion.feature    # Escenarios Gherkin
│
├── steps/
│   └── pokeapi-docs.steps.ts                   # Step Definitions
│
├── src/
│   ├── pages/
│   │   └── web/
│   │       └── PokeAPIDocsPage.ts              # Page Object
│   │
│   ├── tasks/
│   │   └── web/
│   │       └── docs/
│   │           ├── NavigateToPokeAPIDocs.ts    # Task: Navegar
│   │           ├── ClickLink.ts                # Task: Hacer clic
│   │           └── ChangeViewport.ts           # Task: Cambiar viewport
│   │
│   ├── questions/
│   │   └── web/
│   │       └── docs/
│   │           ├── SeeHeading.ts               # Question: Ver encabezado
│   │           ├── SeeLink.ts                  # Question: Ver enlace
│   │           ├── SeeText.ts                  # Question: Ver texto
│   │           ├── SeeDeprecationMessage.ts    # Question: Ver deprecación
│   │           ├── SeeGraphQLTitle.ts          # Question: Ver título GraphQL
│   │           ├── LinksAreClickable.ts        # Question: Enlaces clickeables
│   │           └── ...                         # 15+ Questions
│   │
│   ├── actors/
│   │   └── actor.ts                            # Actor con Abilities
│   │
│   └── abilities/
│       └── browseTheWeb.ts                     # Ability: Navegación web
│
└── package.json                                # Scripts npm
```

## ➕ Agregar Nuevas Pruebas

### 1. Agregar un Nuevo Escenario

Editar `features/pokeapi-docs/navegacion-documentacion.feature`:

```gherkin
@web @nuevo
Escenario: Mi nuevo escenario
  Dado que estoy en la página de documentación de PokeAPI
  Cuando [acción]
  Entonces [verificación]
```

### 2. Crear un Nuevo Task (si es necesario)

Crear archivo `src/tasks/web/docs/MiNuevoTask.ts`:

```typescript
import { Actor } from '../../../actors/actor';
import { Task } from '../../task';
import { PokeAPIDocsPage } from '../../../pages/web/PokeAPIDocsPage';

export class MiNuevoTask implements Task {
  constructor(private parametro: string) {}
  
  static with(parametro: string): MiNuevoTask {
    return new MiNuevoTask(parametro);
  }
  
  async performAs(actor: Actor): Promise<void> {
    const docsPage = (actor as any)._docsPage as PokeAPIDocsPage;
    // Implementar acción
  }
}
```

### 3. Crear una Nueva Question (si es necesario)

Crear archivo `src/questions/web/docs/MiNuevaQuestion.ts`:

```typescript
import { Actor } from '../../../actors/actor';
import { Question } from '../../question';
import { PokeAPIDocsPage } from '../../../pages/web/PokeAPIDocsPage';

export class MiNuevaQuestion implements Question<boolean> {
  static check(): MiNuevaQuestion {
    return new MiNuevaQuestion();
  }
  
  async answeredBy(actor: Actor): Promise<boolean> {
    const docsPage = (actor as any)._docsPage as PokeAPIDocsPage;
    // Implementar verificación
    return true;
  }
}
```

### 4. Agregar Step Definition (si es necesario)

Editar `steps/pokeapi-docs.steps.ts`:

```typescript
When('mi nueva acción', async function (this: CustomWorld) {
  await this.actor.attemptsTo(MiNuevoTask.with('parametro'));
});

Then('mi nueva verificación', async function (this: CustomWorld) {
  const result = await this.actor.asks(MiNuevaQuestion.check());
  expect(result).toBe(true);
});
```

### 5. Agregar Métodos al Page Object (si es necesario)

Editar `src/pages/web/PokeAPIDocsPage.ts`:

```typescript
// Agregar selector
private readonly selectors = {
  // ... selectores existentes
  miNuevoSelector: 'selector-css',
};

// Agregar método
async miNuevoMetodo(): Promise<boolean> {
  try {
    const element = this.page.locator(this.selectors.miNuevoSelector);
    return await element.isVisible({ timeout: 5000 });
  } catch {
    return false;
  }
}
```

## 🔧 Troubleshooting

### Problema: "PokeAPIDocsPage not found in actor context"

**Causa:** El actor no navegó a la página de docs primero.

**Solución:** Asegurarse de que el Background o el primer step sea:
```gherkin
Dado que estoy en la página de documentación de PokeAPI
```

### Problema: Timeout al buscar elementos

**Causa:** Selector incorrecto o elemento no visible.

**Solución:** 
1. Verificar selector en `PokeAPIDocsPage.ts`
2. Aumentar timeout si es necesario
3. Usar estrategias múltiples de búsqueda

### Problema: Tests fallan en modo headless pero pasan en headed

**Causa:** Diferencias de rendering o timing.

**Solución:**
1. Agregar `waitForPageLoad()` después de navegaciones
2. Usar `waitForTimeout()` estratégico
3. Verificar que elementos sean realmente visibles (no solo existan)

## 📊 Reportes

Después de ejecutar las pruebas, generar reportes:

```bash
# Reporte detallado HTML
npm run report:detailed

# Reporte timeline (Chart.js)
npm run report:timeline

# Reporte Allure
npm run report:allure
```

## 🎯 Best Practices

### ✅ DO

- ✅ Usar el patrón Screenplay (Actor → Task → Question)
- ✅ Mantener Page Objects DRY (Don't Repeat Yourself)
- ✅ Usar selectores múltiples para robustez
- ✅ Agregar timeouts apropiados
- ✅ Documentar nuevos métodos del Page Object
- ✅ Usar tags Gherkin para organizar escenarios

### ❌ DON'T

- ❌ Acceder directamente a `page` desde step definitions
- ❌ Duplicar lógica de selectores
- ❌ Usar `waitForTimeout()` sin justificación
- ❌ Ignorar errores de verificación
- ❌ Mezclar lógica de negocio en Page Objects

## 📚 Referencias

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [Screenplay Pattern](https://screenplay.js.org/)
- [PokeAPI Documentation](https://pokeapi.co/docs)

---

**Última actualización:** ${new Date().toISOString().split('T')[0]}
**Mantenido por:** QA Engineering Team
