# Set working directory to project root (parent of scripts/)
Set-Location "$PSScriptRoot\.."

# Function to calculate source hash (Compatible with PowerShell 5.1+)
function Get-ProjectHash {
    # 1. Collect all source and public files
    $files = Get-ChildItem -Path "src", "public" -Recurse -File | Select-Object -ExpandProperty FullName
    # 2. Collect key config files
    $configFiles = (Resolve-Path "vite.config.ts", "index.html", "tailwind.config.js" -ErrorAction SilentlyContinue) | Select-Object -ExpandProperty Path
    
    # 3. Calculate hashes for static files
    $allHashes = ($files + $configFiles) | Sort-Object | ForEach-Object { (Get-FileHash -Path $_ -Algorithm SHA256).Hash }
    
    # 4. Handle package.json and package-lock.json separately (Ignore version lines)
    foreach ($jsonFile in @("package.json", "package-lock.json")) {
        if (Test-Path $jsonFile) {
            # Filter out lines containing "version": to avoid false positives after bumping
            $content = Get-Content -Path $jsonFile | Where-Object { $_ -notmatch '"version":\s*"' }
            $contentBytes = [System.Text.Encoding]::UTF8.GetBytes(($content -join "`n"))
            $sha = [System.Security.Cryptography.SHA256]::Create()
            $allHashes += [System.BitConverter]::ToString($sha.ComputeHash($contentBytes)) -replace '-'
        }
    }
    
    # 5. Create final master hash
    $finalString = $allHashes -join ""
    $shaFinal = [System.Security.Cryptography.SHA256]::Create()
    $finalBytes = [System.Text.Encoding]::UTF8.GetBytes($finalString)
    return [System.BitConverter]::ToString($shaFinal.ComputeHash($finalBytes)) -replace '-'
}

# Check for changes using hashing
$lastDeployFile = ".last_deploy_hash"
$currentHash = Get-ProjectHash

if (Test-Path $lastDeployFile) {
    $lastHash = Get-Content $lastDeployFile
} else {
    $lastHash = ""
}

if ($currentHash -eq $lastHash) {
    Write-Host "No file changes detected since last deploy. Skipping deployment." -ForegroundColor Yellow
    exit 0
}

# Capture old version
$packageJson = Get-Content -Raw -Path "package.json" | ConvertFrom-Json
$OldVersion = $packageJson.version

Write-Host "Current version: $OldVersion" -ForegroundColor Cyan

# Bump version
Write-Host "Bumping version (custom base-10 logic)..." -ForegroundColor Cyan
$v = $OldVersion -split '\.'
[int]$major = $v[0]
[int]$minor = $v[1]
[int]$patch = $v[2]

$patch++
if ($patch -eq 10) {
    $patch = 0
    $minor++
    if ($minor -eq 10) {
        $minor = 0
        $major++
    }
}
$NewVersion = "$major.$minor.$patch"

npm version $NewVersion --no-git-tag-version
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to bump version." -ForegroundColor Red
    exit 1
}

Write-Host "New version: $NewVersion" -ForegroundColor Cyan

# Build project
Write-Host "Building project..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Rolling back to version $OldVersion..." -ForegroundColor Red
    npm version $OldVersion --no-git-tag-version
    exit 1
}

# Deploy to Firebase
Write-Host "Deploying to Firebase..." -ForegroundColor Cyan
firebase deploy --only hosting
if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed! Rolling back to version $OldVersion..." -ForegroundColor Red
    npm version $OldVersion --no-git-tag-version
    exit 1
}

# Update last deploy hash
$currentHash | Out-File -FilePath $lastDeployFile -NoNewline

Write-Host "Successfully deployed version $NewVersion!" -ForegroundColor Green
