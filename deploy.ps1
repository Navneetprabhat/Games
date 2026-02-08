# Deploy site to GitHub Pages (updates gh-pages from current branch)
# Commit your changes first, then run: .\deploy.ps1

$ErrorActionPreference = "Stop"
$repoRoot = $PSScriptRoot
if (-not $repoRoot) { $repoRoot = Get-Location }

Push-Location $repoRoot
try {
    $branch = git rev-parse --abbrev-ref HEAD
    Write-Host "Current branch: $branch" -ForegroundColor Cyan

    git checkout gh-pages 2>&1 | Out-Null

    # Homepage (game chooser)
    git checkout $branch -- index.html home.css home.js 2>&1 | Out-Null
    # Game subfolder
    git checkout $branch -- nested-tic-tac-toe 2>&1 | Out-Null
    git checkout $branch -- .gitignore 2>&1 | Out-Null

    git add index.html home.css home.js .gitignore nested-tic-tac-toe
    $status = git status --porcelain
    if ($status) {
        git commit -m "Update site from $branch"
        git push origin gh-pages
        Write-Host "Deployed to GitHub Pages." -ForegroundColor Green
    } else {
        Write-Host "No changes to deploy." -ForegroundColor Yellow
    }

    git checkout $branch 2>&1 | Out-Null
    Write-Host "Live at: https://navneetprabhat.github.io/Games/" -ForegroundColor Cyan
} finally {
    Pop-Location
}
