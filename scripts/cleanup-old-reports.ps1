#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Clean up old test reports and keep only the most recent N executions.

.DESCRIPTION
    This script manages the test-results directory by removing old test execution reports
    while preserving the most recent ones. This helps maintain a clean workspace and
    prevents disk space issues when running tests multiple times per day.

.PARAMETER KeepLast
    Number of most recent reports to keep. Default is 10.

.PARAMETER ReportType
    Type of reports to clean: html, json, junit, or all. Default is 'all'.

.PARAMETER DryRun
    Show what would be deleted without actually deleting anything.

.PARAMETER Force
    Skip confirmation prompts.

.EXAMPLE
    .\cleanup-old-reports.ps1 -KeepLast 5
    Keep only the 5 most recent reports

.EXAMPLE
    .\cleanup-old-reports.ps1 -KeepLast 10 -ReportType html
    Keep only the 10 most recent HTML reports

.EXAMPLE
    .\cleanup-old-reports.ps1 -KeepLast 3 -DryRun
    Show what would be deleted (dry run mode)
#>

param(
    [Parameter(Mandatory=$false)]
    [int]$KeepLast = 10,

    [Parameter(Mandatory=$false)]
    [ValidateSet('html', 'json', 'junit', 'all')]
    [string]$ReportType = 'all',

    [Parameter(Mandatory=$false)]
    [switch]$DryRun,

    [Parameter(Mandatory=$false)]
    [switch]$Force
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Get script location
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir
$TestResultsDir = Join-Path $RootDir "test-results"

Write-Host "🧹 Cleanup Old Test Reports" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Root Directory: $RootDir" -ForegroundColor Gray
Write-Host "Test Results: $TestResultsDir" -ForegroundColor Gray
Write-Host "Keep Last: $KeepLast reports" -ForegroundColor Gray
Write-Host "Report Type: $ReportType" -ForegroundColor Gray
Write-Host ""

# Validate test-results directory exists
if (-not (Test-Path $TestResultsDir)) {
    Write-Host "⚠️  Test results directory not found: $TestResultsDir" -ForegroundColor Yellow
    Write-Host "Nothing to clean up." -ForegroundColor Yellow
    exit 0
}

# Function to remove old reports by pattern (using approved verb)
function Remove-OldReports {
    param(
        [string]$Pattern,
        [string]$TypeName
    )

    Write-Host "🔍 Looking for $TypeName reports matching pattern: $Pattern" -ForegroundColor Gray

    # Get all matching items sorted by creation time (newest first)
    $Items = Get-ChildItem -Path $TestResultsDir -Filter $Pattern -Directory -ErrorAction SilentlyContinue |
        Sort-Object CreationTime -Descending

    if ($Items.Count -eq 0) {
        Write-Host "   No $TypeName reports found." -ForegroundColor Gray
        return
    }

    Write-Host "   Found $($Items.Count) $TypeName reports" -ForegroundColor Gray

    # Skip if we have fewer items than KeepLast
    if ($Items.Count -le $KeepLast) {
        Write-Host "   ✅ Only $($Items.Count) reports found. Keeping all." -ForegroundColor Green
        return
    }

    # Items to delete (skip the first N items)
    $ToDelete = $Items | Select-Object -Skip $KeepLast

    Write-Host "   📦 Keeping: $KeepLast most recent reports" -ForegroundColor Green
    Write-Host "   🗑️  Deleting: $($ToDelete.Count) old reports" -ForegroundColor Yellow

    # Show items to keep
    Write-Host ""
    Write-Host "   Items to KEEP:" -ForegroundColor Green
    $Items | Select-Object -First $KeepLast | ForEach-Object {
        Write-Host "      ✓ $($_.Name) - $($_.CreationTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Gray
    }

    # Show items to delete
    Write-Host ""
    Write-Host "   Items to DELETE:" -ForegroundColor Yellow
    $ToDelete | ForEach-Object {
        Write-Host "      ✗ $($_.Name) - $($_.CreationTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Gray
    }

    # Dry run mode - don't delete
    if ($DryRun) {
        Write-Host ""
        Write-Host "   ℹ️  DRY RUN MODE - No files were deleted" -ForegroundColor Cyan
        return
    }

    # Confirm deletion
    if (-not $Force) {
        Write-Host ""
        $Confirmation = Read-Host "   ⚠️  Delete $($ToDelete.Count) old reports? (yes/no)"
        if ($Confirmation -ne 'yes') {
            Write-Host "   ❌ Deletion cancelled by user" -ForegroundColor Red
            return
        }
    }

    # Delete old reports
    Write-Host ""
    Write-Host "   🗑️  Deleting old reports..." -ForegroundColor Yellow
    $DeletedCount = 0
    $FailedCount = 0

    foreach ($Item in $ToDelete) {
        try {
            Remove-Item -Path $Item.FullName -Recurse -Force -ErrorAction Stop
            Write-Host "      ✓ Deleted: $($Item.Name)" -ForegroundColor Gray
            $DeletedCount++
        }
        catch {
            Write-Host "      ✗ Failed to delete: $($Item.Name) - $($_.Exception.Message)" -ForegroundColor Red
            $FailedCount++
        }
    }

    Write-Host ""
    Write-Host "   ✅ Deleted: $DeletedCount reports" -ForegroundColor Green
    if ($FailedCount -gt 0) {
        Write-Host "   ⚠️  Failed: $FailedCount reports" -ForegroundColor Yellow
    }
}

# Function to remove old file reports (using approved verb)
function Remove-OldFileReports {
    param(
        [string]$Pattern,
        [string]$TypeName
    )

    Write-Host "🔍 Looking for $TypeName reports matching pattern: $Pattern" -ForegroundColor Gray

    # Get all matching files sorted by creation time (newest first)
    $Files = Get-ChildItem -Path $TestResultsDir -Filter $Pattern -File -ErrorAction SilentlyContinue |
        Sort-Object CreationTime -Descending

    if ($Files.Count -eq 0) {
        Write-Host "   No $TypeName reports found." -ForegroundColor Gray
        return
    }

    Write-Host "   Found $($Files.Count) $TypeName reports" -ForegroundColor Gray

    # Skip if we have fewer files than KeepLast
    if ($Files.Count -le $KeepLast) {
        Write-Host "   ✅ Only $($Files.Count) reports found. Keeping all." -ForegroundColor Green
        return
    }

    # Files to delete (skip the first N files)
    $ToDelete = $Files | Select-Object -Skip $KeepLast

    Write-Host "   📦 Keeping: $KeepLast most recent reports" -ForegroundColor Green
    Write-Host "   🗑️  Deleting: $($ToDelete.Count) old reports" -ForegroundColor Yellow

    # Dry run mode - don't delete
    if ($DryRun) {
        Write-Host ""
        Write-Host "   ℹ️  DRY RUN MODE - No files were deleted" -ForegroundColor Cyan
        return
    }

    # Confirm deletion
    if (-not $Force) {
        Write-Host ""
        $Confirmation = Read-Host "   ⚠️  Delete $($ToDelete.Count) old reports? (yes/no)"
        if ($Confirmation -ne 'yes') {
            Write-Host "   ❌ Deletion cancelled by user" -ForegroundColor Red
            return
        }
    }

    # Delete old reports
    Write-Host ""
    Write-Host "   🗑️  Deleting old reports..." -ForegroundColor Yellow
    $DeletedCount = 0

    foreach ($File in $ToDelete) {
        try {
            Remove-Item -Path $File.FullName -Force -ErrorAction Stop
            Write-Host "      ✓ Deleted: $($File.Name)" -ForegroundColor Gray
            $DeletedCount++
        }
        catch {
            Write-Host "      ✗ Failed to delete: $($File.Name)" -ForegroundColor Red
        }
    }

    Write-Host ""
    Write-Host "   ✅ Deleted: $DeletedCount reports" -ForegroundColor Green
}

# Execute cleanup based on report type
Write-Host ""

switch ($ReportType) {
    'html' {
        Remove-OldReports -Pattern "html-*" -TypeName "HTML"
    }
    'json' {
        Remove-OldFileReports -Pattern "json-*.json" -TypeName "JSON"
    }
    'junit' {
        Remove-OldFileReports -Pattern "junit-*.xml" -TypeName "JUnit XML"
    }
    'all' {
        Remove-OldReports -Pattern "html-*" -TypeName "HTML"
        Write-Host ""
        Remove-OldFileReports -Pattern "json-*.json" -TypeName "JSON"
        Write-Host ""
        Remove-OldFileReports -Pattern "junit-*.xml" -TypeName "JUnit XML"
    }
}

# Calculate disk space saved (approximation)
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "🎉 Cleanup completed!" -ForegroundColor Green
Write-Host ""

# Show remaining reports
$HtmlDirs = Get-ChildItem -Path $TestResultsDir -Filter "html-*" -Directory -ErrorAction SilentlyContinue
$JsonFiles = Get-ChildItem -Path $TestResultsDir -Filter "json-*.json" -File -ErrorAction SilentlyContinue
$JunitFiles = Get-ChildItem -Path $TestResultsDir -Filter "junit-*.xml" -File -ErrorAction SilentlyContinue

Write-Host "📊 Current Report Summary:" -ForegroundColor Cyan
Write-Host "   HTML Reports: $($HtmlDirs.Count)" -ForegroundColor Gray
Write-Host "   JSON Reports: $($JsonFiles.Count)" -ForegroundColor Gray
Write-Host "   JUnit Reports: $($JunitFiles.Count)" -ForegroundColor Gray
Write-Host ""

exit 0
