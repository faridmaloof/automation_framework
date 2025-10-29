/**
 * Page Object for PokeAPI Documentation
 * https://pokeapi.co/docs
 */

import { Page, Locator } from '@playwright/test';

export class PokeAPIDocsPage {
  readonly page: Page;
  
  // Selectors
  private readonly selectors = {
    // Main navigation
    docsHeading: 'h1:has-text("Docs"), h2:has-text("Docs")',
    apiV1Link: 'a:has-text("API v1")',
    apiV2Link: 'a:has-text("API v2")',
    graphQLLink: 'a:has-text("GraphQL")',
    
    // API v1 deprecation
    deprecationMessage: 'text=/End of support for version 1/i',
    deprecationDate: 'text=/After 15 October 2018/i',
    
    // GraphQL section
    graphqlTitle: 'h1:has-text("GraphQL"), h2:has-text("GraphQL"), h3:has-text("GraphQL")',
    graphqlEndpoint: 'text=/graphql.pokeapi.co/i',
    graphiqlSection: 'text=/GraphiQL/i',
    
    // API v2 section
    fairUseTitle: 'text=/Fair Use Policy/i',
    resourcesSections: '[class*="resource"], [id*="resource"], h2, h3',
    endpointExamples: 'code, pre, [class*="endpoint"]',
    
    // General elements
    mainContent: 'main, [role="main"], article, .content',
    navigationLinks: 'nav a, [role="navigation"] a',
    loadingIndicator: '.loading, [class*="spinner"], [aria-busy="true"]',
  };

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to PokeAPI docs page
   */
  async navigateToDocsPage(): Promise<void> {
    await this.page.goto('https://pokeapi.co/docs', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    
    // Wait for page to be fully loaded
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to finish loading
   */
  async waitForPageLoad(): Promise<void> {
    try {
      // Wait for network to be idle
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch {
      // Continue if networkidle timeout
      console.log('Network idle timeout, continuing...');
    }

    // Wait for main content to be visible
    try {
      await this.page.locator(this.selectors.mainContent).first().waitFor({
        state: 'visible',
        timeout: 5000,
      });
    } catch {
      // Continue if main content not found
      console.log('Main content not found, continuing...');
    }
  }

  /**
   * Check if docs heading is visible
   */
  async isDocsHeadingVisible(): Promise<boolean> {
    try {
      const heading = this.page.locator(this.selectors.docsHeading).first();
      await heading.waitFor({ state: 'visible', timeout: 5000 });
      return await heading.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get all navigation links
   */
  async getNavigationLinks(): Promise<string[]> {
    const links = this.page.locator(this.selectors.navigationLinks);
    const count = await links.count();
    
    const linkTexts: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await links.nth(i).textContent();
      if (text) {
        linkTexts.push(text.trim());
      }
    }
    
    return linkTexts;
  }

  /**
   * Check if a specific navigation link exists
   */
  async hasNavigationLink(linkText: string): Promise<boolean> {
    try {
      // Try multiple variations of the link text
      const variations = [
        `a:has-text("${linkText}")`,
        `text=${linkText}`,
        `text=/${linkText}/i`,
      ];
      
      for (const selector of variations) {
        const element = this.page.locator(selector).first();
        const visible = await element.isVisible({ timeout: 2000 }).catch(() => false);
        if (visible) {
          return true;
        }
      }
      
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Click on a navigation link by text
   */
  async clickNavigationLink(linkText: string): Promise<void> {
    // Wait a bit for the page to be ready
    await this.page.waitForTimeout(500);
    
    // Try multiple selector strategies
    const selectors = [
      `a:has-text("${linkText}")`,
      `button:has-text("${linkText}")`,
      `[role="link"]:has-text("${linkText}")`,
      `text=${linkText}`,
    ];
    
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector).first();
        const visible = await element.isVisible({ timeout: 2000 });
        
        if (visible) {
          await element.click({ timeout: 5000 });
          await this.waitForPageLoad();
          return;
        }
      } catch {
        continue;
      }
    }
    
    throw new Error(`No se pudo encontrar el enlace: ${linkText}`);
  }

  /**
   * Check if deprecation message is visible
   */
  async isDeprecationMessageVisible(): Promise<boolean> {
    try {
      const message = this.page.locator(this.selectors.deprecationMessage).first();
      return await message.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Check if deprecation date is visible
   */
  async isDeprecationDateVisible(): Promise<boolean> {
    try {
      const date = this.page.locator(this.selectors.deprecationDate).first();
      return await date.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Check if text is visible on the page
   */
  async isTextVisible(text: string): Promise<boolean> {
    try {
      const element = this.page.locator(`text=/${text}/i`).first();
      return await element.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Check if GraphQL title is visible
   */
  async isGraphQLTitleVisible(): Promise<boolean> {
    try {
      const title = this.page.locator(this.selectors.graphqlTitle).first();
      return await title.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Check if GraphQL endpoint URL is visible
   */
  async isGraphQLEndpointVisible(): Promise<boolean> {
    try {
      const endpoint = this.page.locator(this.selectors.graphqlEndpoint).first();
      return await endpoint.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Check if GraphiQL section is visible
   */
  async isGraphiQLSectionVisible(): Promise<boolean> {
    try {
      const section = this.page.locator(this.selectors.graphiqlSection).first();
      return await section.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Check if Fair Use Policy title is visible
   */
  async isFairUseTitleVisible(): Promise<boolean> {
    try {
      const title = this.page.locator(this.selectors.fairUseTitle).first();
      return await title.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Check if resource sections are visible
   */
  async areResourceSectionsVisible(): Promise<boolean> {
    try {
      const sections = this.page.locator(this.selectors.resourcesSections);
      const count = await sections.count();
      return count > 0;
    } catch {
      return false;
    }
  }

  /**
   * Check if endpoint examples are visible
   */
  async areEndpointExamplesVisible(): Promise<boolean> {
    try {
      const examples = this.page.locator(this.selectors.endpointExamples);
      const count = await examples.count();
      return count > 0;
    } catch {
      return false;
    }
  }

  /**
   * Verify all main links are clickable
   */
  async areAllMainLinksClickable(): Promise<boolean> {
    const mainLinks = [
      this.selectors.apiV1Link,
      this.selectors.apiV2Link,
      this.selectors.graphQLLink,
    ];
    
    for (const selector of mainLinks) {
      try {
        const link = this.page.locator(selector).first();
        const visible = await link.isVisible({ timeout: 2000 });
        if (!visible) {
          return false;
        }
        
        const enabled = await link.isEnabled();
        if (!enabled) {
          return false;
        }
      } catch {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Verify all main links have valid URLs
   */
  async doAllMainLinksHaveValidURLs(): Promise<boolean> {
    const mainLinks = [
      this.selectors.apiV1Link,
      this.selectors.apiV2Link,
      this.selectors.graphQLLink,
    ];
    
    for (const selector of mainLinks) {
      try {
        const link = this.page.locator(selector).first();
        const href = await link.getAttribute('href');
        
        if (!href || href === '#' || href === '') {
          return false;
        }
      } catch {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Change viewport size based on device type
   */
  async changeViewportSize(deviceType: string): Promise<void> {
    const viewportSizes: Record<string, { width: number; height: number }> = {
      'móvil': { width: 375, height: 667 },    // iPhone SE
      'mobile': { width: 375, height: 667 },
      'tablet': { width: 768, height: 1024 },  // iPad
      'escritorio': { width: 1920, height: 1080 }, // Desktop
      'desktop': { width: 1920, height: 1080 },
    };
    
    const size = viewportSizes[deviceType.toLowerCase()];
    if (size) {
      await this.page.setViewportSize(size);
      await this.page.waitForTimeout(500); // Wait for reflow
    } else {
      throw new Error(`Tipo de dispositivo no reconocido: ${deviceType}`);
    }
  }

  /**
   * Check if navigation is accessible
   */
  async isNavigationAccessible(): Promise<boolean> {
    try {
      const nav = this.page.locator('nav, [role="navigation"]').first();
      return await nav.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Check if content is readable (not overlapping or hidden)
   */
  async isContentReadable(): Promise<boolean> {
    try {
      const content = this.page.locator(this.selectors.mainContent).first();
      const isVisible = await content.isVisible({ timeout: 5000 });
      
      if (!isVisible) {
        return false;
      }
      
      // Check if content has reasonable dimensions
      const box = await content.boundingBox();
      if (box && box.width > 100 && box.height > 100) {
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  }
}
