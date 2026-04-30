# Set working directory to project root (parent of scripts/)
Set-Location "$PSScriptRoot\.."

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

Write-Host "Successfully deployed version $NewVersion!" -ForegroundColor Green
