/**
 * Generate Timeline Report from Cucumber JSON
 * 
 * Este script genera un reporte visual tipo timeline/gantt
 * mostrando la ejecución de tests en el tiempo
 */

import * as fs from 'fs';
import * as path from 'path';

interface CucumberStep {
  result: {
    status: string;
    duration?: number;
  };
}

interface CucumberElement {
  name: string;
  steps: CucumberStep[];
}

interface CucumberFeature {
  name: string;
  elements: CucumberElement[];
}

interface ScenarioData {
  name: string;
  duration: number;
  feature: string;
  status: 'passed' | 'failed';
}

class TimelineReportGenerator {
  private readonly REPORT_INPUT = 'reports/cucumber-report.json';
  private readonly REPORT_OUTPUT = 'reports/timeline-report.html';

  async generate(): Promise<void> {
    console.log('📊 Generando Timeline Report...\n');

    // Verificar que existe el JSON
    if (!fs.existsSync(this.REPORT_INPUT)) {
      console.error(`❌ No se encontró ${this.REPORT_INPUT}`);
      console.log('   Ejecuta primero: npm test');
      process.exit(1);
    }

    // Leer JSON
    const cucumberData: CucumberFeature[] = JSON.parse(
      fs.readFileSync(this.REPORT_INPUT, 'utf-8')
    );

    // Generar HTML
    const html = this.generateHTML(cucumberData);

    // Guardar HTML
    fs.writeFileSync(this.REPORT_OUTPUT, html);
    console.log(`✅ Timeline Report generado: ${this.REPORT_OUTPUT}`);
    console.log(`   Abre: ${path.resolve(this.REPORT_OUTPUT)}\n`);
  }

  private generateHTML(cucumberData: CucumberFeature[]): string {
    const stats = this.calculateStats(cucumberData);

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Timeline Report - Test Execution</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
  <style>
    ${this.getStyles()}
  </style>
</head>
<body>
  <div class="header">
    <h1>⏱️ Timeline Report - Test Execution</h1>
    <p>Generado: ${new Date().toLocaleString('es-ES')}</p>
  </div>

  <div class="stats">
    <div class="stat-card">
      <div class="stat-value">${stats.features}</div>
      <div class="stat-label">Features Ejecutados</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${stats.scenarios}</div>
      <div class="stat-label">Escenarios Totales</div>
    </div>
    <div class="stat-card passed">
      <div class="stat-value">${stats.passed}</div>
      <div class="stat-label">✅ Pasados</div>
    </div>
    <div class="stat-card failed">
      <div class="stat-value">${stats.failed}</div>
      <div class="stat-label">❌ Fallidos</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${this.formatDuration(stats.totalDuration)}</div>
      <div class="stat-label">⏱ Duración Total</div>
    </div>
  </div>

  <div class="chart-container">
    <canvas id="timelineChart"></canvas>
  </div>

  <script>
    ${this.getChartScript(cucumberData)}
  </script>
</body>
</html>`;
  }

  private calculateStats(cucumberData: CucumberFeature[]) {
    let features = 0;
    let scenarios = 0;
    let passed = 0;
    let failed = 0;
    let totalDuration = 0;

    cucumberData.forEach(feature => {
      features++;
      feature.elements.forEach(scenario => {
        scenarios++;
        const scenarioStatus = this.getScenarioStatus(scenario);
        if (scenarioStatus === 'passed') passed++;
        else failed++;

        totalDuration += this.calculateScenarioDuration(scenario);
      });
    });

    return { features, scenarios, passed, failed, totalDuration };
  }

  private getScenarioStatus(scenario: CucumberElement): 'passed' | 'failed' {
    return scenario.steps.every(s => s.result.status === 'passed')
      ? 'passed'
      : 'failed';
  }

  private calculateScenarioDuration(scenario: CucumberElement): number {
    return scenario.steps.reduce((acc, step) => {
      return acc + (step.result.duration || 0);
    }, 0) / 1000000; // nanosegundos a milisegundos
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(1);
    return `${minutes}m ${seconds}s`;
  }

  private getStyles(): string {
    return `
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.header {
  background: white;
  color: #333;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-align: center;
}

.header h1 {
  margin: 0;
  font-size: 2.5em;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header p {
  margin: 10px 0 0;
  color: #666;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.stat-card.passed {
  border-top: 4px solid #4caf50;
}

.stat-card.failed {
  border-top: 4px solid #f44336;
}

.stat-value {
  font-size: 2.5em;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-size: 0.95em;
  font-weight: 500;
}

.chart-container {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  min-height: 500px;
}

canvas {
  max-height: 800px !important;
}

@media (max-width: 768px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .header h1 {
    font-size: 1.8em;
  }
}`;
  }

  private getChartScript(cucumberData: CucumberFeature[]): string {
    // Extraer datos para el timeline
    const scenarios: ScenarioData[] = [];
    
    cucumberData.forEach(feature => {
      feature.elements.forEach(scenario => {
        const duration = this.calculateScenarioDuration(scenario);
        const status = this.getScenarioStatus(scenario);
        
        scenarios.push({
          name: scenario.name,
          duration: duration,
          feature: feature.name,
          status: status
        });
      });
    });

    return `
const data = ${JSON.stringify(scenarios, null, 2)};

const ctx = document.getElementById('timelineChart');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: data.map(s => s.name.length > 50 ? s.name.substring(0, 50) + '...' : s.name),
    datasets: [{
      label: 'Duración (ms)',
      data: data.map(s => s.duration.toFixed(2)),
      backgroundColor: data.map(s => 
        s.status === 'passed' ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)'
      ),
      borderColor: data.map(s => 
        s.status === 'passed' ? 'rgb(76, 175, 80)' : 'rgb(244, 67, 54)'
      ),
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Duración de Escenarios por Test',
        font: {
          size: 20,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          title: function(context) {
            return data[context[0].dataIndex].name;
          },
          label: function(context) {
            const duration = parseFloat(context.formattedValue);
            return 'Duración: ' + (duration < 1000 ? duration.toFixed(0) + 'ms' : (duration / 1000).toFixed(2) + 's');
          },
          afterLabel: function(context) {
            return 'Feature: ' + data[context.dataIndex].feature;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Duración (milisegundos)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  }
});`;
  }
}

// Ejecutar directamente
const generator = new TimelineReportGenerator();
generator.generate().catch(console.error);

export default TimelineReportGenerator;
