<#
.SYNOPSIS
    TechWizard 2.0 Auto Git Sync
.DESCRIPTION
    Continuously monitors the project folder and auto-commits/pushes changes 
    to GitHub every 10 seconds if any files were modified.
#>

$repoPath = "C:\Users\dyuti\OneDrive\Documents\TechWizard 2.0\TechWizard 2.0-V1"

if (-not (Test-Path $repoPath)) {
    Write-Error "Repository path not found: $repoPath"
    exit
}

Set-Location -Path $repoPath

# Verify Git
git status > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "Git not found or repo not initialized."
    exit
}

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   TechWizard 2.0 LIVE MONITORING ACTIVE    " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Monitoring: $repoPath" -ForegroundColor DarkGray
Write-Host "Detecting saves and syncing to GitHub instantly..." -ForegroundColor Green
Write-Host "Keep this window open. Press Ctrl+C to stop." -ForegroundColor Yellow
Write-Host ""

# Function to perform the sync
function Sync-ToGitHub {
    $statusOut = git status --porcelain
    if (![string]::IsNullOrEmpty($statusOut)) {
        $timestamp = (Get-Date).ToString("HH:mm:ss")
        Write-Host "[$timestamp] Changes detected! Syncing..." -ForegroundColor Yellow
        
        git add .
        git commit -m "auto-sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-Null
        
        $pushOut = git push origin main 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[$timestamp] Successfully pushed to GitHub. ✅" -ForegroundColor Green
        }
        else {
            Write-Host "[$timestamp] Sync FAILED. Check internet connection. ❌" -ForegroundColor Red
            Write-Host $pushOut -ForegroundColor DarkGray
        }
        Write-Host "Waiting for next change..." -ForegroundColor DarkGray
    }
}

# Create FileSystemWatcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $repoPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Register events
$changed = Register-ObjectEvent $watcher "Changed" -Action { Sync-ToGitHub }
$created = Register-ObjectEvent $watcher "Created" -Action { Sync-ToGitHub }
$deleted = Register-ObjectEvent $watcher "Deleted" -Action { Sync-ToGitHub }
$renamed = Register-ObjectEvent $watcher "Renamed" -Action { Sync-ToGitHub }

# Initial sync check in case something changed while offline
Sync-ToGitHub

# Keep script alive
try {
    while ($true) { Start-Sleep -Seconds 5 }
}
finally {
    # Cleanup on exit
    $watcher.EnableRaisingEvents = $false
    Unregister-Event -SourceIdentifier $changed.Name
    Unregister-Event -SourceIdentifier $created.Name
    Unregister-Event -SourceIdentifier $deleted.Name
    Unregister-Event -SourceIdentifier $renamed.Name
    $watcher.Dispose()
}

