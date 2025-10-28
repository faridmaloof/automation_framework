import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];

export default defineConfig({
  testDir: './',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 4,
  
  // Configurar grep para filtrar por tags
  grep: process.env.TAGS ? new RegExp(process.env.TAGS) : undefined,
  
  outputDir: 'test-results/output',
  
  reporter: [
    ['html', { outputFolder: `test-results/reports/html-${timestamp}`, open: 'never' }],
    ['json', { outputFile: `test-results/reports/json-${timestamp}.json` }],
    ['junit', { outputFile: `test-results/reports/junit-${timestamp}.xml` }],
    ['list'],
  ],
  
  use: {
    baseURL: 'https://pokeapi.co',
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    // Web UI Tests
    { 
      name: 'chromium', 
      testMatch: /.*\.web\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] } 
    },
    { 
      name: 'firefox', 
      testMatch: /.*\.web\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] } 
    },
    { 
      name: 'webkit', 
      testMatch: /.*\.web\.spec\.ts/,
      use: { ...devices['Desktop Safari'] } 
    },
    
    // Mobile Tests
    { 
      name: 'Mobile Chrome', 
      testMatch: /.*\.web\.spec\.ts/,
      use: { ...devices['Pixel 5'] } 
    },
    { 
      name: 'Mobile Safari', 
      testMatch: /.*\.web\.spec\.ts/,
      use: { ...devices['iPhone 13 Pro'] } 
    },
    
    // API Tests
    { 
      name: 'api', 
      testMatch: /.*\/(api|integration)\/.*\.spec\.ts/,
      use: { 
        baseURL: 'https://pokeapi.co/api/v2',
        extraHTTPHeaders: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      } 
    },
    
    // BDD-Style Tests (Screenplay Pattern)
    { 
      name: 'bdd', 
      testMatch: /.*tests-bdd\/.*\.spec\.ts/,
      use: { 
        baseURL: 'https://pokeapi.co/api/v2',
        extraHTTPHeaders: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      } 
    },
    
    // GraphQL Tests
    { 
      name: 'graphql', 
      testMatch: /.*graphql.*\.spec\.ts/,
      use: { 
        baseURL: 'https://beta.pokeapi.co/graphql/v1beta',
        extraHTTPHeaders: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      } 
    },
    
    // Contract Testing
    { 
      name: 'contract', 
      testMatch: /.*\/contract\/.*\.spec\.ts/,
      use: { 
        baseURL: 'https://pokeapi.co/api/v2',
        extraHTTPHeaders: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      } 
    },
  ],
});
