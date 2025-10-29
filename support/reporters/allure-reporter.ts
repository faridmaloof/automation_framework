/**
 * Allure Reporter for Cucumber
 * Convierte reportes Cucumber JSON a formato Allure
 */

import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

interface CucumberTag {
  name: string;
}

interface CucumberEmbedding {
  data: string;
  mime_type: string;
}

interface CucumberStepResult {
  status: string;
  duration?: number;
  error_message?: string;
}

interface CucumberStep {
  keyword: string;
  name: string;
  result?: CucumberStepResult;
  embeddings?: CucumberEmbedding[];
}

interface CucumberElement {
  name: string;
  description?: string;
  type?: string;
  keyword?: string;
  tags?: CucumberTag[];
  steps?: CucumberStep[];
}

interface CucumberFeature {
  name: string;
  keyword: string;
  description?: string;
  tags?: CucumberTag[];
  elements?: CucumberElement[];
}

interface AllureStatusDetails {
  message?: string;
  trace?: string;
}

interface AllureAttachment {
  name: string;
  source: string;
  type: string;
}

interface AllureLabel {
  name: string;
  value: string;
}

interface AllureStep {
  name: string;
  status: string;
  statusDetails?: AllureStatusDetails;
  stage: string;
  start: number;
  stop: number;
  attachments?: AllureAttachment[];
}

interface AllureResult {
  uuid: string;
  historyId: string;
  fullName: string;
  name: string;
  description: string;
  labels: AllureLabel[];
  links: any[];
  status: string;
  statusDetails?: AllureStatusDetails;
  stage: string;
  start: number;
  stop: number;
  steps: AllureStep[];
  attachments: AllureAttachment[];
  parameters: any[];
}

interface AllureCategory {
  name: string;
  matchedStatuses: string[];
  messageRegex?: string;
}

class AllureReporter {
  private readonly allureResultsDir: string;

  constructor() {
    // Use process.cwd() for TypeScript/ts-node compatibility
    this.allureResultsDir = path.join(process.cwd(), 'reports', 'allure-results');
    this.ensureDir(this.allureResultsDir);
  }

  private ensureDir(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  convertCucumberToAllure(cucumberJsonPath: string): void {
    if (!fs.existsSync(cucumberJsonPath)) {
      console.error(`❌ No se encontró ${cucumberJsonPath}`);
      return;
    }

    const cucumberData: CucumberFeature[] = JSON.parse(
      fs.readFileSync(cucumberJsonPath, 'utf8')
    );
    const timestamp = Date.now();

    cucumberData.forEach((feature) => {
      feature.elements?.forEach((scenario) => {
        const allureResult = this.convertScenarioToAllure(feature, scenario, timestamp);
        const filename = `${allureResult.uuid}-result.json`;
        const filepath = path.join(this.allureResultsDir, filename);
        fs.writeFileSync(filepath, JSON.stringify(allureResult, null, 2));
      });
    });

    // Generar environment.properties
    this.generateEnvironmentProperties();

    // Generar categories.json
    this.generateCategories();

    console.log(`✅ Allure results generados en: ${this.allureResultsDir}`);
  }

  private convertScenarioToAllure(
    feature: CucumberFeature,
    scenario: CucumberElement,
    timestamp: number
  ): AllureResult {
    const uuid = uuidv4();
    const startTime = timestamp;

    // Calcular duración total del scenario
    let totalDuration = 0;
    const steps: AllureStep[] = [];

    scenario.steps?.forEach((step, stepIdx) => {
      const stepDuration = step.result?.duration
        ? Math.floor(step.result.duration / 1000000)
        : 0;
      totalDuration += stepDuration;

      const stepResult: AllureStep = {
        name: `${step.keyword}${step.name}`,
        status: this.mapStatus(step.result?.status || 'unknown'),
        statusDetails: step.result?.error_message
          ? {
              message: step.result.error_message,
              trace: step.result.error_message,
            }
          : undefined,
        stage: 'finished',
        start: startTime + stepIdx * 100,
        stop: startTime + stepIdx * 100 + stepDuration,
        attachments: this.processAttachments(step.embeddings),
      };

      steps.push(stepResult);
    });

    const stopTime = startTime + totalDuration;

    // Determinar status del scenario
    const scenarioStatus = this.getScenarioStatus(scenario.steps);

    return {
      uuid,
      historyId: this.generateHistoryId(feature.name, scenario.name),
      fullName: `${feature.name}: ${scenario.name}`,
      name: scenario.name,
      description: scenario.description || '',
      labels: this.generateLabels(feature, scenario),
      links: [],
      status: scenarioStatus,
      statusDetails: this.getScenarioStatusDetails(scenario.steps),
      stage: 'finished',
      start: startTime,
      stop: stopTime,
      steps,
      attachments: [],
      parameters: [],
    };
  }

  private mapStatus(cucumberStatus: string): string {
    const statusMap: Record<string, string> = {
      passed: 'passed',
      failed: 'failed',
      skipped: 'skipped',
      pending: 'broken',
      undefined: 'broken',
      ambiguous: 'broken',
    };
    return statusMap[cucumberStatus] || 'unknown';
  }

  private getScenarioStatus(steps?: CucumberStep[]): string {
    if (!steps || steps.length === 0) return 'unknown';

    const hasFailed = steps.some((s) => s.result?.status === 'failed');
    const hasSkipped = steps.some((s) => s.result?.status === 'skipped');
    const allPassed = steps.every((s) => s.result?.status === 'passed');

    if (hasFailed) return 'failed';
    if (hasSkipped) return 'skipped';
    if (allPassed) return 'passed';
    return 'broken';
  }

  private getScenarioStatusDetails(steps?: CucumberStep[]): AllureStatusDetails | undefined {
    const failedStep = steps?.find((s) => s.result?.status === 'failed');
    if (failedStep && failedStep.result?.error_message) {
      return {
        message: failedStep.result.error_message,
        trace: failedStep.result.error_message,
      };
    }
    return undefined;
  }

  private processAttachments(embeddings?: CucumberEmbedding[]): AllureAttachment[] {
    if (!embeddings || embeddings.length === 0) return [];

    const attachments: AllureAttachment[] = [];

    embeddings.forEach((embed, idx) => {
      const uuid = uuidv4();
      const name = `attachment-${idx}`;
      const type = embed.mime_type || 'text/plain';
      const extension = this.getExtensionFromMimeType(type);

      // Guardar attachment
      const filename = `${uuid}-attachment.${extension}`;
      const filepath = path.join(this.allureResultsDir, filename);

      try {
        const buffer = Buffer.from(embed.data, 'base64');
        fs.writeFileSync(filepath, buffer);

        attachments.push({
          name,
          source: filename,
          type,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error guardando attachment: ${errorMessage}`);
      }
    });

    return attachments;
  }

  private getExtensionFromMimeType(mimeType: string): string {
    const mimeMap: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/gif': 'gif',
      'text/plain': 'txt',
      'text/html': 'html',
      'application/json': 'json',
      'video/webm': 'webm',
    };
    return mimeMap[mimeType] || 'txt';
  }

  private generateLabels(feature: CucumberFeature, scenario: CucumberElement): AllureLabel[] {
    const labels: AllureLabel[] = [
      { name: 'feature', value: feature.name },
      { name: 'suite', value: feature.name },
      { name: 'story', value: scenario.name },
    ];

    // Agregar tags como labels
    const tags = [...(feature.tags || []), ...(scenario.tags || [])];
    tags.forEach((tag) => {
      const tagName = tag.name.replace('@', '');

      // Clasificar tags
      if (tagName.includes('smoke')) {
        labels.push({ name: 'severity', value: 'critical' });
        labels.push({ name: 'tag', value: tagName });
      } else if (tagName.includes('regression')) {
        labels.push({ name: 'severity', value: 'normal' });
        labels.push({ name: 'tag', value: tagName });
      } else if (tagName === 'api') {
        labels.push({ name: 'testType', value: 'api' });
      } else if (tagName === 'web') {
        labels.push({ name: 'testType', value: 'ui' });
      } else if (tagName === 'mobile') {
        labels.push({ name: 'testType', value: 'mobile' });
      } else {
        labels.push({ name: 'tag', value: tagName });
      }
    });

    return labels;
  }

  private generateHistoryId(featureName: string, scenarioName: string): string {
    // Generar ID consistente para trending
    const str = `${featureName}:${scenarioName}`;
    return crypto.createHash('md5').update(str).digest('hex');
  }

  private generateEnvironmentProperties(): void {
    const env = process.env;
    const properties = [
      `environment=${env.ENVIRONMENT || 'development'}`,
      `base.url=${env.BASE_URL || 'https://pokeapi.co'}`,
      `browser=${env.BROWSER || 'chromium'}`,
      `headless=${env.HEADLESS || 'true'}`,
      `parallel=${env.CUCUMBER_PARALLEL || '2'}`,
      `node.version=${process.version}`,
      `os=${process.platform}`,
      `timestamp=${new Date().toISOString()}`,
    ];

    const filepath = path.join(this.allureResultsDir, 'environment.properties');
    fs.writeFileSync(filepath, properties.join('\n'));
  }

  private generateCategories(): void {
    const categories: AllureCategory[] = [
      {
        name: 'API Tests',
        matchedStatuses: ['passed', 'failed', 'broken'],
        messageRegex: '.*api.*',
      },
      {
        name: 'Web Tests',
        matchedStatuses: ['passed', 'failed', 'broken'],
        messageRegex: '.*web.*',
      },
      {
        name: 'Failed Tests',
        matchedStatuses: ['failed'],
      },
      {
        name: 'Broken Tests',
        matchedStatuses: ['broken'],
      },
      {
        name: 'Product Defects',
        matchedStatuses: ['failed'],
        messageRegex: '.*defect.*',
      },
    ];

    const filepath = path.join(this.allureResultsDir, 'categories.json');
    fs.writeFileSync(filepath, JSON.stringify(categories, null, 2));
  }
}

export default AllureReporter;

// Si se ejecuta directamente (no como import)
if (require.main === module) {
  const reporter = new AllureReporter();
  const cucumberJsonPath = path.join(process.cwd(), 'reports', 'cucumber-report.json');
  reporter.convertCucumberToAllure(cucumberJsonPath);
}
