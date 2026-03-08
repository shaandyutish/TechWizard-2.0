<#
.SYNOPSIS
    TechWizard 2.0 Auto Git Sync
.DESCRIPTION
    Continuously monitors the project folder and auto-commits/pushes changes 
    to GitHub every 10 seconds if any files were modified.
#>

$repoPath = "c:\Users\dyuti\OneDrive\Documents\TechWizard 2.0"

# Verify path exists
if (-not (Test-Path $repoPath)) {
    Write-Error "Repository path not found: $repoPath"
    exit
}

# Change directory
Set-Location -Path $repoPath

# Check if git exists and repo is initialized
$gitStatus = git status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "Git repository not found or git is not installed. Please initialize first."
    exit
}

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   TechWizard 2.0 Auto-Sync Watcher Started  " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Monitoring for file changes every 10 seconds..." -ForegroundColor DarkGray
Write-Host "Keep this window open while you work. Press Ctrl+C to stop." -ForegroundColor Yellow
Write-Host ""

while ($true) {
    # Wait for 10 seconds between checks to batch rapid saves
    Start-Sleep -Seconds 10
    
    # Check if there are any modified, untracked, or deleted files
    $statusOut = git status --porcelain
    
    if (![string]::IsNullOrEmpty($statusOut)) {
        $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        Write-Host "[$timestamp] Changes detected. Syncing..." -ForegroundColor Yellow
        
        # Add all changed files
        git add .
        
        # Commit with timestamp
        git commit -m "auto-sync: $timestamp" | Out-Null
        
        # Push to main branch silently
        $pushOut = git push origin main 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[$timestamp] Successfully synced to GitHub." -ForegroundColor Green
        }
        else {
            Write-Host "[$timestamp] Sync failed! Ensure you are connected to the internet and GitHub is set up." -ForegroundColor Red
            Write-Host $pushOut -ForegroundColor DarkGray
        }
        Write-Host "---" -ForegroundColor DarkGray
    }
}
