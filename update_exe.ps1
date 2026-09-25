<#
.SYNOPSIS
    Automated Helper Script to Attach / Update your Video Editor .EXE file for the Website.
#>

param (
    [string]$SourceExe = "",
    [string]$Version = "2.5.0",
    [string]$AppName = "ApexCut Studio"
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$downloadsDir = Join-Path $scriptDir "downloads"
$configFile = Join-Path $scriptDir "js\config.js"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   ApexCut Video Studio - App .EXE Attachment Assistant   " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not (Test-Path $downloadsDir)) {
    New-Item -ItemType Directory -Path $downloadsDir -Force | Out-Null
}

$targetExePath = ""

if ($SourceExe -ne "" -and (Test-Path $SourceExe)) {
    $srcItem = Get-Item $SourceExe
    $targetName = "ApexCut-Setup-v" + $Version + ".exe"
    $targetExePath = Join-Path $downloadsDir $targetName
    Write-Host "[+] Copying '$($srcItem.FullName)' to '$targetExePath'..." -ForegroundColor Green
    Copy-Item -Path $srcItem.FullName -Destination $targetExePath -Force
} else {
    $exeFiles = Get-ChildItem -Path $downloadsDir -Filter "*.exe" | Sort-Object LastWriteTime -Descending
    if ($exeFiles.Count -gt 0) {
        $targetExePath = $exeFiles[0].FullName
        Write-Host "[i] Using existing .exe in downloads: '$($exeFiles[0].Name)'" -ForegroundColor Yellow
    } else {
        Write-Host "[!] No .exe file found! Please provide a path using -SourceExe, or place an .exe in the downloads/ folder." -ForegroundColor Red
        exit 1
    }
}

$exeItem = Get-Item $targetExePath
$fileName = $exeItem.Name
$sizeBytes = $exeItem.Length
$sizeMB = [math]::Round($sizeBytes / 1MB, 2)
if ($sizeMB -lt 1) {
    $displaySize = "$([math]::Round($sizeBytes / 1KB, 1)) KB"
} else {
    $displaySize = "$sizeMB MB"
}

Write-Host "[*] Calculating SHA-256 Hash..." -ForegroundColor Gray
$sha256 = (Get-FileHash -Path $targetExePath -Algorithm SHA256).Hash.ToLower()

Write-Host "`n=== Application .EXE Details ===" -ForegroundColor Green
Write-Host "File Name     : $fileName" -ForegroundColor White
Write-Host "File Size     : $displaySize ($sizeBytes bytes)" -ForegroundColor White
Write-Host "SHA-256 Hash  : $sha256" -ForegroundColor White
Write-Host "Download Path : downloads/$fileName" -ForegroundColor White
Write-Host "================================`n" -ForegroundColor Green

if (Test-Path $configFile) {
    $dateStr = (Get-Date).ToString("MMMM dd, yyyy")
    $content = Get-Content $configFile -Raw

    $content = [System.Text.RegularExpressions.Regex]::Replace($content, 'fileName:\s*"[^"]*"', ('fileName: "' + $fileName + '"'))
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, 'fileSize:\s*"[^"]*"', ('fileSize: "' + $displaySize + '"'))
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, 'sha256:\s*"[^"]*"', ('sha256: "' + $sha256 + '"'))
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, 'version:\s*"[^"]*"', ('version: "' + $Version + '"'))
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, 'releaseDate:\s*"[^"]*"', ('releaseDate: "' + $dateStr + '"'))

    Set-Content -Path $configFile -Value $content -Encoding UTF8
    Write-Host "[OK] Successfully updated js/config.js with latest .exe info!" -ForegroundColor Cyan
}

Write-Host "`nDone! Open index.html in your browser to test your download link.`n" -ForegroundColor Green
