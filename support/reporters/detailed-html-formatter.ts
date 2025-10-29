/**
 * Detailed HTML Formatter with Duration Metrics
 * Genera reporte HTML con tiempos detallados por Step, Scenario y Feature
 */
import { Formatter, IFormatterOptions } from '@cucumber/cucumber';
import { 
  EventEmitter 
} from 'events';
import * as fs from 'fs';
import * as path from 'path';

interface StepMetrics {
  name: string;
  status: string;
  duration: number;
  error?: string;
}

interface ScenarioMetrics {
  name: string;
  status: string;
  duration: number;
  steps: StepMetrics[];
}

interface FeatureMetrics {
  name: string;
  duration: number;
  scenarios: ScenarioMetrics[];
}

export default class DetailedHtmlFormatter extends Formatter {
  private features: Map<string, FeatureMetrics> = new Map();
  private currentFeature: FeatureMetrics | null = null;
  private currentScenario: ScenarioMetrics | null = null;
  private startTimes: Map<string, number> = new Map();

  constructor(options: IFormatterOptions) {
    super(options);

    // Escuchar eventos de Cucumber
    options.eventBroadcaster.on('envelope', (envelope: any) => {
      if (envelope.testRunStarted) {
        this.onTestRunStarted();
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

  private onTestRunStarted(): void {
    this.features.clear();
  }

  private onTestCaseStarted(event: any): void {
    const featureName = this.getFeatureName(event);
    const scenarioName = this.getScenarioName(event);
    
    // Inicializar feature si no existe
    if (!this.features.has(featureName)) {
      this.currentFeature = {
        name: featureName,
        duration: 0,
        scenarios: []
      };
      this.features.set(featureName, this.currentFeature);
    } else {
      this.currentFeature = this.features.get(featureName)!;
    }
    
    // Inicializar scenario
    this.currentScenario = {
      name: scenarioName,
      status: 'passed',
      duration: 0,
      steps: []
    };
    this.currentFeature.scenarios.push(this.currentScenario);
    
    this.startTimes.set(`scenario_${event.testCaseId}`, Date.now());
  }

  private onTestStepStarted(event: any): void {
    this.startTimes.set(`step_${event.testStepId}`, Date.now());
  }

  private onTestStepFinished(event: any): void {
    if (!this.currentScenario) return;
    
    const startTime = this.startTimes.get(`step_${event.testStepId}`);
    if (!startTime) return;
    
    const duration = Date.now() - startTime;
    const step = this.getStepInfo(event);
    
    if (step) {
      this.currentScenario.steps.push({
        name: step.name,
        status: event.testStepResult.status,
        duration: duration,
        error: event.testStepResult.message
      });
    }
  }

  private onTestCaseFinished(event: any): void {
    if (!this.currentScenario || !this.currentFeature) return;
    
    const startTime = this.startTimes.get(`scenario_${event.testCaseId}`);
    if (startTime) {
      this.currentScenario.duration = Date.now() - startTime;
      this.currentFeature.duration += this.currentScenario.duration;
    }
    
    // Determinar estado del scenario basado en steps
    const hasFailedStep = this.currentScenario.steps.some(s => 
      s.status === 'FAILED' || s.status === 'failed'
    );
    this.currentScenario.status = hasFailedStep ? 'failed' : 'passed';
  }

  private onTestRunFinished(): void {
    this.generateHtmlReport();
  }

  private getFeatureName(event: any): string {
    // Extraer nombre del feature desde el evento
    return event.testCase?.pickle?.uri || 'Unknown Feature';
  }

  private getScenarioName(event: any): string {
    return event.testCase?.pickle?.name || 'Unknown Scenario';
  }

  private getStepInfo(event: any): { name: string } | null {
    const stepId = event.testStepId;
    // Aquí deberías mapear el stepId al nombre real del step
    // Por simplicidad, retornamos un placeholder
    return { name: `Step ${stepId}` };
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) {
      return `${ms}ms`;
    } else if (ms < 60000) {
      return `${(ms / 1000).toFixed(2)}s`;
    } else {
      const minutes = Math.floor(ms / 60000);
      const seconds = ((ms % 60000) / 1000).toFixed(2);
      return `${minutes}m ${seconds}s`;
    }
  }

  private generateHtmlReport(): void {
    const html = this.buildHtmlContent();
    const outputPath = path.join(process.cwd(), 'reports', 'detailed-report.html');
    
    // Crear directorio si no existe
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, html);
    console.log(`\n📊 Detailed Report generado: ${outputPath}\n`);
  }

  private buildHtmlContent(): string {
    let totalDuration = 0;
    let totalScenarios = 0;
    let totalSteps = 0;
    let passedScenarios = 0;
    let failedScenarios = 0;

    this.features.forEach(feature => {
      totalDuration += feature.duration;
      feature.scenarios.forEach(scenario => {
        totalScenarios++;
        totalSteps += scenario.steps.length;
        if (scenario.status === 'passed') passedScenarios++;
        else failedScenarios++;
      });
    });

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cucumber Detailed Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      color: #333;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    
    .header p {
      font-size: 1.1em;
      opacity: 0.9;
    }
    
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      padding: 40px;
      background: #f8f9fa;
    }
    
    .summary-card {
      background: white;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s ease;
    }
    
    .summary-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }
    
    .summary-card .value {
      font-size: 2.5em;
      font-weight: bold;
      margin: 10px 0;
    }
    
    .summary-card .label {
      color: #666;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .summary-card.duration .value {
      color: #667eea;
    }
    
    .summary-card.scenarios .value {
      color: #764ba2;
    }
    
    .summary-card.passed .value {
      color: #28a745;
    }
    
    .summary-card.failed .value {
      color: #dc3545;
    }
    
    .features {
      padding: 40px;
    }
    
    .feature {
      margin-bottom: 40px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .feature-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .feature-name {
      font-size: 1.3em;
      font-weight: bold;
    }
    
    .feature-duration {
      font-size: 1.1em;
      background: rgba(255,255,255,0.2);
      padding: 5px 15px;
      border-radius: 20px;
    }
    
    .scenario {
      border-bottom: 1px solid #e0e0e0;
    }
    
    .scenario:last-child {
      border-bottom: none;
    }
    
    .scenario-header {
      background: #f8f9fa;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    
    .scenario-header:hover {
      background: #e9ecef;
    }
    
    .scenario-name {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.85em;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .status-badge.passed {
      background: #d4edda;
      color: #155724;
    }
    
    .status-badge.failed {
      background: #f8d7da;
      color: #721c24;
    }
    
    .scenario-duration {
      font-weight: bold;
      color: #667eea;
    }
    
    .steps {
      background: white;
      display: none;
    }
    
    .steps.expanded {
      display: block;
    }
    
    .step {
      padding: 12px 40px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background 0.2s ease;
    }
    
    .step:hover {
      background: #f8f9fa;
    }
    
    .step:last-child {
      border-bottom: none;
    }
    
    .step-name {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .step-icon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
    
    .step-icon.passed {
      background: #28a745;
    }
    
    .step-icon.failed {
      background: #dc3545;
    }
    
    .step-icon.skipped {
      background: #ffc107;
    }
    
    .step-duration {
      color: #666;
      font-size: 0.9em;
    }
    
    .step-error {
      padding: 15px 40px;
      background: #f8d7da;
      color: #721c24;
      font-family: 'Courier New', monospace;
      font-size: 0.85em;
      white-space: pre-wrap;
      border-left: 4px solid #dc3545;
      margin: 0 20px 10px 20px;
    }
    
    .footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #666;
      font-size: 0.9em;
    }
    
    .toggle-icon {
      transition: transform 0.3s ease;
    }
    
    .toggle-icon.expanded {
      transform: rotate(90deg);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🥒 Cucumber Test Report</h1>
      <p>Detailed execution metrics with step-by-step timing</p>
    </div>
    
    <div class="summary">
      <div class="summary-card duration">
        <div class="label">Total Duration</div>
        <div class="value">${this.formatDuration(totalDuration)}</div>
      </div>
      <div class="summary-card scenarios">
        <div class="label">Scenarios</div>
        <div class="value">${totalScenarios}</div>
      </div>
      <div class="summary-card passed">
        <div class="label">Passed</div>
        <div class="value">${passedScenarios}</div>
      </div>
      <div class="summary-card failed">
        <div class="label">Failed</div>
        <div class="value">${failedScenarios}</div>
      </div>
      <div class="summary-card">
        <div class="label">Total Steps</div>
        <div class="value">${totalSteps}</div>
      </div>
      <div class="summary-card">
        <div class="label">Features</div>
        <div class="value">${this.features.size}</div>
      </div>
    </div>
    
    <div class="features">
      ${Array.from(this.features.values()).map(feature => this.renderFeature(feature)).join('')}
    </div>
    
    <div class="footer">
      Generated on ${new Date().toLocaleString()} | Powered by Cucumber + Screenplay Pattern
    </div>
  </div>
  
  <script>
    function toggleScenario(scenarioId) {
      const steps = document.getElementById(scenarioId);
      const icon = document.getElementById(scenarioId + '-icon');
      steps.classList.toggle('expanded');
      icon.classList.toggle('expanded');
    }
  </script>
</body>
</html>
    `;
  }

  private renderFeature(feature: FeatureMetrics): string {
    const featureName = path.basename(feature.name, '.feature');
    
    return `
      <div class="feature">
        <div class="feature-header">
          <div class="feature-name">📄 ${featureName}</div>
          <div class="feature-duration">⏱️ ${this.formatDuration(feature.duration)}</div>
        </div>
        ${feature.scenarios.map((scenario, idx) => this.renderScenario(scenario, idx)).join('')}
      </div>
    `;
  }

  private renderScenario(scenario: ScenarioMetrics, index: number): string {
    const scenarioId = `scenario-${index}-${Date.now()}`;
    
    return `
      <div class="scenario">
        <div class="scenario-header" onclick="toggleScenario('${scenarioId}')">
          <div class="scenario-name">
            <span id="${scenarioId}-icon" class="toggle-icon">▶</span>
            <span>${scenario.name}</span>
            <span class="status-badge ${scenario.status}">${scenario.status}</span>
          </div>
          <div class="scenario-duration">⏱️ ${this.formatDuration(scenario.duration)}</div>
        </div>
        <div id="${scenarioId}" class="steps">
          ${scenario.steps.map(step => this.renderStep(step)).join('')}
        </div>
      </div>
    `;
  }

  private renderStep(step: StepMetrics): string {
    const statusClass = step.status.toLowerCase();
    
    return `
      <div class="step">
        <div class="step-name">
          <div class="step-icon ${statusClass}"></div>
          <span>${step.name}</span>
        </div>
        <div class="step-duration">${this.formatDuration(step.duration)}</div>
      </div>
      ${step.error ? `<div class="step-error">${this.escapeHtml(step.error)}</div>` : ''}
    `;
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}
