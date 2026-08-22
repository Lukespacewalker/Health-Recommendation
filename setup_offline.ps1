$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
New-Item -ItemType Directory -Force -Path "vendor" | Out-Null

$files = @{
  "vendor/reveal.css" = "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/reveal.css"
  "vendor/reveal.js" = "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/reveal.js"
  "vendor/notes.js" = "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/plugin/notes.js"
  "vendor/zoom.js" = "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/plugin/zoom.js"
  "vendor/three.module.min.js" = "https://cdn.jsdelivr.net/npm/three@0.184.0/build/three.module.min.js"
}

foreach ($target in $files.Keys) {
  Write-Host "Downloading $target"
  Invoke-WebRequest -Uri $files[$target] -OutFile $target -UseBasicParsing
}

Write-Host ""
Write-Host "Offline libraries installed successfully." -ForegroundColor Green
Write-Host "Run start_windows.bat and the deck will prefer the local copies."
