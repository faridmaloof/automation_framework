import { Page } from '@playwright/test';

/**
 * Base Page Object with common functionality
 * All page objects should extend this class
 */
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('load');
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
      // Continue if network doesn't go idle
    });
  }

  /**
   * Navigate to URL
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({ 
      path: `./reports/screenshots/${name}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for selector to be visible
   */
  async waitForSelector(selector: string, timeout: number = 10000): Promise<void> {
    await this.page.locator(selector).first().waitFor({ 
      state: 'visible', 
      timeout 
    });
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector: string, timeout: number = 5000): Promise<boolean> {
    try {
      await this.waitForSelector(selector, timeout);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Click on element
   */
  async click(selector: string): Promise<void> {
    await this.page.locator(selector).first().click();
  }

  /**
   * Fill input field
   */
  async fill(selector: string, value: string): Promise<void> {
    await this.page.locator(selector).first().fill(value);
  }

  /**
   * Get text content
   */
  async getText(selector: string): Promise<string> {
    const element = this.page.locator(selector).first();
    const text = await element.textContent();
    return text?.trim() || '';
  }

  /**
   * Get attribute value
   */
  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return await this.page.locator(selector).first().getAttribute(attribute);
  }
}
