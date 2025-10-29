/**
 * Enhanced Summary Formatter
 * Muestra duración detallada de Features, Scenarios y Steps en consola
 */
import { SummaryFormatter } from '@cucumber/cucumber';
import type { IFormatterOptions } from '@cucumber/cucumber';
import chalk from 'chalk';

interface FeatureMetric {
  name: string;
  uri: string;
  scenarios: ScenarioMetric[];
  startTime: number | null;
  endTime: number | null;
}

interface ScenarioMetric {
  id: string;
  steps: StepMetric[];
  startTime: number;
  duration?: number;
  status?: string;
}

interface StepMetric {
  id: string;
  duration: number;
  status: string;
}

class EnhancedSummaryFormatter extends SummaryFormatter {
  private featureMetrics: Map<string, FeatureMetric>;
  private scenarioStartTimes: Map<string, number>;
  private stepStartTimes: Map<string, number>;
  private currentFeature: FeatureMetric | null;
  private currentScenario: ScenarioMetric | null;

  constructor(options: IFormatterOptions) {
    super(options);

    this.featureMetrics = new Map();
    this.scenarioStartTimes = new Map();
    this.stepStartTimes = new Map();
    this.currentFeature = null;
    this.currentScenario = null;

    // Escuchar eventos
    options.eventBroadcaster.on('envelope', (envelope: any) => {
      if (envelope.gherkinDocument) {
        this.onGherkinDocument(envelope.gherkinDocument);
      }
      if (envelope.pickle) {
        this.onPickle(envelope.pickle);
      }
      if (envelope.testCaseStarted) {
        this.onTestCaseStarted(envelope.testCaseStarted);
      }
      if (envelope.testStepStarted) {
        this.onTestStepStarted(envelope.testStepStarted);
      }
      if (envelope.testStepFinished) {
        this.onTestStepFinished(envelope.testStepFinished);
      }
      if (envelope.testCaseFinished) {
        this.onTestCaseFinished(envelope.testCaseFinished);
      }
      if (envelope.testRunFinished) {
        this.onTestRunFinished();
      }
    });
  }

  private onGherkinDocument(gherkinDocument: any): void {
    if (gherkinDocument.feature) {
      this.currentFeature = {
        name: gherkinDocument.feature.name,
        uri: gherkinDocument.uri,
        scenarios: [],
        startTime: null,
        endTime: null,
      };
      this.featureMetrics.set(gherkinDocument.uri, this.currentFeature);
    }
  }

  private onPickle(_pickle: any): void {
    // Guardamos info del pickle para mapeo posterior
  }

  private onTestCaseStarted(testCaseStarted: any): void {
    const startTime = Date.now();
    this.scenarioStartTimes.set(testCaseStarted.id, startTime);

    if (this.currentFeature && !this.currentFeature.startTime) {
      this.currentFeature.startTime = startTime;
    }

    this.currentScenario = {
      id: testCaseStarted.id,
      steps: [],
      startTime: startTime,
    };
  }

  private onTestStepStarted(testStepStarted: any): void {
    this.stepStartTimes.set(testStepStarted.testStepId, Date.now());
  }

  private onTestStepFinished(testStepFinished: any): void {
    const startTime = this.stepStartTimes.get(testStepFinished.testStepId);
    if (startTime && this.currentScenario) {
      const duration = Date.now() - startTime;
      this.currentScenario.steps.push({
        id: testStepFinished.testStepId,
        duration: duration,
        status: testStepFinished.testStepResult.status,
      });
    }
  }

  private onTestCaseFinished(testCaseFinished: any): void {
    const startTime = this.scenarioStartTimes.get(testCaseFinished.testCaseStartedId);
    if (startTime && this.currentScenario && this.currentFeature) {
      const duration = Date.now() - startTime;
      this.currentScenario.duration = duration;
      this.currentScenario.status = testCaseFinished.testCaseResult.status;
      this.currentFeature.scenarios.push({ ...this.currentScenario });
      this.currentFeature.endTime = Date.now();
    }
  }

  private onTestRunFinished(): void {
    this.logDetailedSummary();
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) {
      return chalk.cyan(`${ms}ms`);
    } else if (ms < 60000) {
      return chalk.cyan(`${(ms / 1000).toFixed(3)}s`);
    } else {
      const minutes = Math.floor(ms / 60000);
      const seconds = ((ms % 60000) / 1000).toFixed(3);
      return chalk.cyan(`${minutes}m ${seconds}s`);
    }
  }

  private getStatusIcon(status: string): string {
    switch (status) {
      case 'PASSED':
        return chalk.green('✓');
      case 'FAILED':
        return chalk.red('✗');
      case 'SKIPPED':
        return chalk.yellow('○');
      case 'PENDING':
        return chalk.yellow('◐');
      default:
        return chalk.gray('?');
    }
  }

  private logDetailedSummary(): void {
    console.log('\n' + chalk.bold.magenta('═'.repeat(80)));
    console.log(chalk.bold.magenta('  📊 DETAILED EXECUTION METRICS'));
    console.log(chalk.bold.magenta('═'.repeat(80)) + '\n');

    let totalDuration = 0;
    let totalScenarios = 0;
    let totalSteps = 0;
    let passedScenarios = 0;
    let failedScenarios = 0;

    this.featureMetrics.forEach((feature, uri) => {
      if (!feature.startTime || !feature.endTime) return;

      const featureDuration = feature.endTime - feature.startTime;
      totalDuration += featureDuration;

      console.log(chalk.bold.blue('📄 Feature: ') + chalk.bold(feature.name));
      console.log(chalk.gray('   URI: ') + uri);
      console.log(chalk.bold('   Duration: ') + this.formatDuration(featureDuration));
      console.log();

      feature.scenarios.forEach((scenario, idx) => {
        totalScenarios++;
        totalSteps += scenario.steps.length;

        if (scenario.status === 'PASSED') passedScenarios++;
        else if (scenario.status === 'FAILED') failedScenarios++;

        const statusIcon = this.getStatusIcon(scenario.status || 'UNKNOWN');
        console.log(`   ${statusIcon} Scenario #${idx + 1}`);
        console.log(`      Duration: ${this.formatDuration(scenario.duration || 0)}`);
        console.log(`      Status: ${this.getStatusColor(scenario.status || 'UNKNOWN')}`);

        if (scenario.steps.length > 0) {
          console.log(chalk.gray(`      Steps (${scenario.steps.length}):`));
          scenario.steps.forEach((step, stepIdx) => {
            const stepIcon = this.getStatusIcon(step.status);
            console.log(
              `         ${stepIcon} Step ${stepIdx + 1}: ${this.formatDuration(step.duration)}`
            );
          });
        }
        console.log();
      });

      console.log(chalk.gray('─'.repeat(80)) + '\n');
    });

    // Summary final
    console.log(chalk.bold.magenta('═'.repeat(80)));
    console.log(chalk.bold.magenta('  📈 SUMMARY'));
    console.log(chalk.bold.magenta('═'.repeat(80)));
    console.log();
    console.log(chalk.bold('  Total Duration:    ') + this.formatDuration(totalDuration));
    console.log(chalk.bold('  Total Features:    ') + chalk.cyan(this.featureMetrics.size));
    console.log(chalk.bold('  Total Scenarios:   ') + chalk.cyan(totalScenarios));
    console.log(chalk.bold('  Total Steps:       ') + chalk.cyan(totalSteps));
    console.log(chalk.bold('  Passed Scenarios:  ') + chalk.green(passedScenarios));
    console.log(chalk.bold('  Failed Scenarios:  ') + chalk.red(failedScenarios));
    console.log();
    console.log(chalk.bold.magenta('═'.repeat(80)) + '\n');
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'PASSED':
        return chalk.green(status);
      case 'FAILED':
        return chalk.red(status);
      case 'SKIPPED':
        return chalk.yellow(status);
      case 'PENDING':
        return chalk.yellow(status);
      default:
        return chalk.gray(status);
    }
  }
}

export default EnhancedSummaryFormatter;
