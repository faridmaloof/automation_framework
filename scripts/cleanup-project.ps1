# Script para limpiar el proyecto y dejar solo lo necesario para Cucumber + Screenplay Pattern

Write-Host "🧹 Iniciando limpieza del proyecto..." -ForegroundColor Cyan

# Directorios a eliminar (ya no necesarios)
$directoriesToRemove = @(
    "tests",              # Framework Playwright antiguo
    "tests-bdd",          # BDD antiguo
    "reference-framework", # Framework de referencia (ya migrado)
    "team-projects",      # Orchestrator (no necesario)
    "orchestrator",       # Orchestrator (no necesario)
    "dist",               # Build artifacts
    "test-results",       # Resultados antiguos
    "docs"                # Docs antiguas
)

# Archivos de configuración duplicados/obsoletos
$filesToRemove = @(
    "cucumber.config.js",     # Usamos cucumber.json
    "cucumber.config.ts",     # Usamos cucumber.json
    ".cucumber.js",           # Obsoleto
    "playwright.config.ts",   # Ya no usamos Playwright Test directamente
    ".ts-node.json",          # No necesario con cucumber.json
    "example.spec.ts",        # Ejemplo antiguo
    
    # Docs obsoletos (mantenemos solo los importantes)
    "BONUS_ACHIEVEMENT.md",
    "COMMANDS_AND_TROUBLESHOOTING.md",
    "IMPLEMENTATION_PLAN.md",
    "MIGRATION-COMPLETE.md",
    "project_requiment_v1.md",
    "project_requiment_v2.md",
    "QUICKSTART.md",
    "README-BDD.md",
    "REFACTORING_GUIDE.md",
    "STATUS.md"
)

# Eliminar directorios
foreach ($dir in $directoriesToRemove) {
    $path = Join-Path $PSScriptRoot "..\$dir"
    if (Test-Path $path) {
        Write-Host "❌ Eliminando directorio: $dir" -ForegroundColor Yellow
        Remove-Item -Path $path -Recurse -Force
    }
}

# Eliminar archivos
foreach ($file in $filesToRemove) {
    $path = Join-Path $PSScriptRoot "..\$file"
    if (Test-Path $path) {
        Write-Host "❌ Eliminando archivo: $file" -ForegroundColor Yellow
        Remove-Item -Path $path -Force
    }
}

Write-Host ""
Write-Host "✅ Limpieza completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Estructura final:" -ForegroundColor Cyan
Write-Host "  ├── features/           # Features por funcionalidad" -ForegroundColor White
Write-Host "  ├── steps/              # Step definitions" -ForegroundColor White
Write-Host "  ├── support/            # Hooks y world" -ForegroundColor White
Write-Host "  ├── src/                # Screenplay Pattern" -ForegroundColor White
Write-Host "  │   ├── actors/" -ForegroundColor White
Write-Host "  │   ├── abilities/" -ForegroundColor White
Write-Host "  │   ├── tasks/" -ForegroundColor White
Write-Host "  │   └── questions/" -ForegroundColor White
Write-Host "  ├── reports/            # Reportes Cucumber" -ForegroundColor White
Write-Host "  ├── logs/               # Logs de ejecución" -ForegroundColor White
Write-Host "  └── cucumber.json       # Configuración" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Para ejecutar tests:" -ForegroundColor Cyan
Write-Host "  npm run test:api:rest:smoke" -ForegroundColor White
Write-Host ""
