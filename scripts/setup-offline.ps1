$ErrorActionPreference = "Stop"
$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $projectRoot
New-Item -ItemType Directory -Force -Path "public/vendor" | Out-Null

$files = @{
  "public/vendor/reveal.css" = "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/reveal.css"
  "public/vendor/reveal.js" = "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/reveal.js"
  "public/vendor/notes.js" = "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/plugin/notes.js"
  "public/vendor/zoom.js" = "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/plugin/zoom.js"
  "public/vendor/three.module.min.js" = "https://cdn.jsdelivr.net/npm/three@0.184.0/build/three.module.min.js"
  "public/vendor/three.core.min.js" = "https://cdn.jsdelivr.net/npm/three@0.184.0/build/three.core.min.js"
}

foreach ($target in $files.Keys) {
  Write-Host "Downloading $target"
  Invoke-WebRequest -Uri $files[$target] -OutFile $target -UseBasicParsing
}

Write-Host ""
Write-Host "Offline libraries installed successfully." -ForegroundColor Green
Write-Host "Run npm start and the deck will prefer the local copies."
