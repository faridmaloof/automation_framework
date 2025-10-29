/**
 * Generador de Reporte Detallado con Evidencia
 * Genera un reporte HTML interactivo con durations, screenshots, logs y JSON
 */

import * as fs from 'fs';
import * as path from 'path';

interface CucumberElement {
  name: string;
  keyword: string;
  tags?: Array<{ name: string }>;
  type?: string;
  steps?: CucumberStep[];
  before?: CucumberHook[];
  after?: CucumberHook[];
}

interface CucumberStep {
  name: string;
  keyword: string;
  result?: {
    status: string;
    duration?: number;
    error_message?: string;
  };
  embeddings?: Array<{
    data: string;
    mime_type: string;
  }>;
}

interface CucumberHook {
  result?: {
    status: string;
    duration?: number;
  };
}

interface CucumberFeature {
  name: string;
  keyword: string;
  description?: string;
  tags?: Array<{ name: string }>;
  elements?: CucumberElement[];
  uri?: string;
}

interface FeatureMetrics {
  totalDuration: number;
  scenarios: number;
  steps: number;
  passed: number;
  failed: number;
  skipped: number;
}

class DetailedReportGenerator {
  private cucumberData: CucumberFeature[] = [];
  private reportPath: string;

  constructor() {
    const reportsDir = path.join(process.cwd(), 'reports');
    this.reportPath = path.join(reportsDir, 'detailed-report.html');
  }

  async generate(): Promise<void> {
    console.log('📊 Generando reporte detallado con evidencia...\n');

    // Leer datos de Cucumber
    const jsonPath = path.join(process.cwd(), 'reports', 'cucumber-report.json');
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ No se encontró cucumber-report.json');
      console.error(`   Esperado en: ${jsonPath}`);
      return;
    }

    this.cucumberData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    // Generar HTML
    const html = this.generateHTML();

    // Escribir archivo
    fs.writeFileSync(this.reportPath, html, 'utf-8');

    console.log(`✅ Reporte detallado generado: ${this.reportPath}\n`);
  }

  private generateHTML(): string {
    const featureCards = this.cucumberData
      .map(feature => this.renderFeature(feature))
      .join('\n');

    const summary = this.calculateSummary();

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte Detallado - Cucumber Tests</title>
  <style>
    ${this.getStyles()}
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1>🥒 Reporte Detallado de Pruebas</h1>
      <div class="timestamp">Generado: ${new Date().toLocaleString('es-ES')}</div>
    </header>

    <div class="summary">
      <div class="summary-card">
        <div class="summary-label">Features</div>
        <div class="summary-value">${summary.features}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Scenarios</div>
        <div class="summary-value">${summary.scenarios}</div>
      </div>
      <div class="summary-card passed">
        <div class="summary-label">✓ Passed</div>
        <div class="summary-value">${summary.passed}</div>
      </div>
      <div class="summary-card failed">
        <div class="summary-label">✗ Failed</div>
        <div class="summary-value">${summary.failed}</div>
      </div>
      <div class="summary-card skipped">
        <div class="summary-label">○ Skipped</div>
        <div class="summary-value">${summary.skipped}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">⏱ Total Duration</div>
        <div class="summary-value">${this.formatDuration(summary.totalDuration)}</div>
      </div>
    </div>

    ${featureCards}
  </div>

  <!-- Modal para screenshots -->
  <div id="imageModal" class="modal" onclick="closeModal()">
    <span class="modal-close" onclick="closeModal()">&times;</span>
    <img id="modalImage" class="modal-content">
  </div>

  <script>
    ${this.getScripts()}
  </script>
</body>
</html>`;
  }

  private renderFeature(feature: CucumberFeature): string {
    const metrics = this.calculateFeatureMetrics(feature);
    const tags = feature.tags?.map(t => t.name).join(' ') || '';

    return `
<div class="feature">
  <div class="feature-header">
    <div class="feature-title">
      <span class="feature-keyword">${feature.keyword}:</span>
      ${this.escapeHtml(feature.name)}
    </div>
    <div class="feature-tags">${this.escapeHtml(tags)}</div>
    <div class="feature-metrics">
      <span class="metric">⏱ ${this.formatDuration(metrics.totalDuration)}</span>
      <span class="metric">📊 ${metrics.scenarios} scenarios</span>
      <span class="metric">🎯 ${metrics.steps} steps</span>
    </div>
  </div>

  ${feature.elements?.map(element => this.renderScenario(element)).join('\n') || ''}
</div>`;
  }

  private renderScenario(scenario: CucumberElement): string {
    const tags = scenario.tags?.map(t => t.name).join(' ') || '';
    const status = this.getScenarioStatus(scenario);
    const duration = this.calculateScenarioDuration(scenario);

    return `
<div class="scenario ${status}">
  <div class="scenario-header">
    <div class="scenario-title">
      <span class="status-icon">${this.getStatusIcon(status)}</span>
      <span class="scenario-keyword">${scenario.keyword}:</span>
      ${this.escapeHtml(scenario.name)}
    </div>
    <div class="scenario-info">
      ${tags ? `<span class="scenario-tags">${this.escapeHtml(tags)}</span>` : ''}
      <span class="scenario-duration">⏱ ${this.formatDuration(duration)}</span>
    </div>
  </div>

  <div class="steps">
    ${scenario.steps?.map(step => this.renderStep(step)).join('\n') || ''}
  </div>
</div>`;
  }

  private renderStep(step: CucumberStep): string {
    const status = step.result?.status || 'pending';
    const duration = step.result?.duration ? step.result.duration / 1000000 : 0;
    const error = step.result?.error_message;
    const embeddings = step.embeddings || [];

    // Procesar evidencia (screenshots, logs, JSON)
    const evidenceHtml = embeddings.length > 0 ? `
<div class="step-evidence">
  ${embeddings.map((embed, idx) => {
    if (embed.mime_type && embed.mime_type.startsWith('image/')) {
      return `
<div class="evidence-item">
  <div class="evidence-label">📸 Screenshot ${idx + 1}</div>
  <img src="data:${embed.mime_type};base64,${embed.data}" 
       class="evidence-screenshot"
       onclick="openModal(this.src); event.stopPropagation();" 
       alt="Screenshot ${idx + 1}">
</div>`;
    } else if (embed.mime_type === 'text/plain') {
      const text = Buffer.from(embed.data, 'base64').toString('utf-8');
      return `
<div class="evidence-item">
  <div class="evidence-label">📝 Log</div>
  <pre class="evidence-log">${this.escapeHtml(text)}</pre>
</div>`;
    } else if (embed.mime_type === 'application/json') {
      const jsonData = Buffer.from(embed.data, 'base64').toString('utf-8');
      try {
        const formatted = JSON.stringify(JSON.parse(jsonData), null, 2);
        return `
<div class="evidence-item">
  <div class="evidence-label">📋 JSON Data</div>
  <pre class="evidence-json">${this.escapeHtml(formatted)}</pre>
</div>`;
      } catch {
        return `
<div class="evidence-item">
  <div class="evidence-label">📋 Data</div>
  <pre class="evidence-log">${this.escapeHtml(jsonData)}</pre>
</div>`;
      }
    }
    return '';
  }).join('')}
</div>` : '';

    return `
<div class="step ${status}">
  <div class="step-content">
    <span class="step-status">${this.getStatusIcon(status)}</span>
    <span class="step-keyword">${step.keyword}</span>
    <span class="step-name">${this.escapeHtml(step.name)}</span>
  </div>
  <div class="step-duration">⏱ ${this.formatDuration(duration)}</div>
  ${error ? `<div class="step-error">${this.escapeHtml(error)}</div>` : ''}
  ${evidenceHtml}
</div>`;
  }

  private calculateSummary() {
    let features = 0;
    let scenarios = 0;
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    let totalDuration = 0;

    this.cucumberData.forEach(feature => {
      features++;
      feature.elements?.forEach(element => {
        scenarios++;
        const status = this.getScenarioStatus(element);
        if (status === 'passed') passed++;
        else if (status === 'failed') failed++;
        else skipped++;

        totalDuration += this.calculateScenarioDuration(element);
      });
    });

    return { features, scenarios, passed, failed, skipped, totalDuration };
  }

  private calculateFeatureMetrics(feature: CucumberFeature): FeatureMetrics {
    let totalDuration = 0;
    let scenarios = 0;
    let steps = 0;
    let passed = 0;
    let failed = 0;
    let skipped = 0;

    feature.elements?.forEach(element => {
      scenarios++;
      steps += element.steps?.length || 0;

      const status = this.getScenarioStatus(element);
      if (status === 'passed') passed++;
      else if (status === 'failed') failed++;
      else skipped++;

      totalDuration += this.calculateScenarioDuration(element);
    });

    return { totalDuration, scenarios, steps, passed, failed, skipped };
  }

  private calculateScenarioDuration(scenario: CucumberElement): number {
    let duration = 0;

    // Before hooks
    scenario.before?.forEach(hook => {
      duration += hook.result?.duration || 0;
    });

    // Steps
    scenario.steps?.forEach(step => {
      duration += step.result?.duration || 0;
    });

    // After hooks
    scenario.after?.forEach(hook => {
      duration += hook.result?.duration || 0;
    });

    return duration / 1000000; // Convert to milliseconds
  }

  private getScenarioStatus(scenario: CucumberElement): string {
    const steps = scenario.steps || [];
    if (steps.some(s => s.result?.status === 'failed')) return 'failed';
    if (steps.every(s => s.result?.status === 'passed')) return 'passed';
    if (steps.some(s => s.result?.status === 'skipped')) return 'skipped';
    return 'pending';
  }

  private getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      passed: '✓',
      failed: '✗',
      skipped: '○',
      pending: '◷',
      undefined: '?'
    };
    return icons[status] || '?';
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(1);
    return `${minutes}m ${seconds}s`;
  }

  private escapeHtml(text: string): string {
    if (!text) return '';
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }

  private getStyles(): string {
    return `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  line-height: 1.6;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  text-align: center;
}

.header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.timestamp {
  opacity: 0.9;
  font-size: 0.9em;
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  padding: 30px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.summary-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.summary-card.passed {
  border-top: 4px solid #4caf50;
}

.summary-card.failed {
  border-top: 4px solid #f44336;
}

.summary-card.skipped {
  border-top: 4px solid #ff9800;
}

.summary-label {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 2em;
  font-weight: bold;
  color: #333;
}

.feature {
  margin: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.feature-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-bottom: 2px solid #667eea;
}

.feature-title {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 10px;
}

.feature-keyword {
  color: #667eea;
  font-weight: bold;
}

.feature-tags {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 10px;
}

.feature-metrics {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.metric {
  background: white;
  padding: 5px 12px;
  border-radius: 4px;
  font-size: 0.9em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.scenario {
  margin: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.scenario.passed {
  border-left: 4px solid #4caf50;
}

.scenario.failed {
  border-left: 4px solid #f44336;
}

.scenario.skipped {
  border-left: 4px solid #ff9800;
}

.scenario-header {
  background: #f8f9fa;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.scenario-title {
  font-size: 1.2em;
  font-weight: 600;
}

.scenario-keyword {
  color: #764ba2;
  font-weight: bold;
}

.status-icon {
  font-size: 1.2em;
  margin-right: 8px;
}

.scenario-info {
  display: flex;
  gap: 15px;
  align-items: center;
}

.scenario-tags {
  color: #666;
  font-size: 0.9em;
}

.scenario-duration {
  font-size: 0.9em;
  color: #666;
}

.steps {
  padding: 10px 0;
}

.step {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 15px;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.step:hover {
  background: #f8f9fa;
}

.step:last-child {
  border-bottom: none;
}

.step.passed {
  background: rgba(76, 175, 80, 0.05);
}

.step.failed {
  background: rgba(244, 67, 54, 0.05);
}

.step-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.step-status {
  font-size: 1.2em;
  width: 24px;
  text-align: center;
}

.step-keyword {
  font-weight: 600;
  color: #764ba2;
}

.step-name {
  color: #333;
}

.step-duration {
  color: #999;
  font-size: 0.9em;
  white-space: nowrap;
}

.step-error {
  grid-column: 1 / -1;
  background: #fff3f3;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
  padding: 15px;
  margin-top: 10px;
  color: #c62828;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  white-space: pre-wrap;
}

/* EVIDENCIA - NUEVO */
.step-evidence {
  grid-column: 1 / -1;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.evidence-item {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  transition: box-shadow 0.3s ease;
}

.evidence-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.evidence-label {
  font-weight: 600;
  color: #667eea;
  margin-bottom: 10px;
  font-size: 0.95em;
}

.evidence-screenshot {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: block;
}

.evidence-screenshot:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.evidence-log,
.evidence-json {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', Consolas, Monaco, monospace;
  font-size: 0.85em;
  line-height: 1.5;
  max-height: 400px;
  overflow-y: auto;
}

.evidence-json {
  color: #a6e22e;
}

/* Modal para screenshots fullscreen */
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.modal.active {
  display: flex;
}

.modal-content {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 35px;
  color: white;
  font-size: 40px;
  font-weight: bold;
  transition: 0.3s;
  cursor: pointer;
}

.modal-close:hover,
.modal-close:focus {
  color: #bbb;
}

@media (max-width: 768px) {
  .summary {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .step {
    grid-template-columns: 1fr;
  }
  
  .step-duration {
    justify-self: start;
  }
}`;
  }

  private getScripts(): string {
    return `
function openModal(src) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  modal.classList.add('active');
  modalImg.src = src;
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('active');
}

// Cerrar modal con ESC
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
});`;
  }
}

// Ejecutar directamente
const generator = new DetailedReportGenerator();
generator.generate().catch(console.error);

export default DetailedReportGenerator;
