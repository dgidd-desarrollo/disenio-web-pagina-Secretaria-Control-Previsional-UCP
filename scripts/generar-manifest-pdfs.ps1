# Regenera assets/pdfs/manifest.json a partir de los PDF en esa carpeta.
$pdfDir = Join-Path $PSScriptRoot "..\assets\pdfs"
$docs = Get-ChildItem $pdfDir -Filter *.pdf -ErrorAction SilentlyContinue |
  Sort-Object Name |
  ForEach-Object {
    @{
      file  = $_.Name
      title = ($_.BaseName -replace '\s+', ' ').Trim()
    }
  }

@{ documents = @($docs) } | ConvertTo-Json -Depth 3 |
  Set-Content -Path (Join-Path $pdfDir "manifest.json") -Encoding UTF8

Write-Host "manifest.json actualizado con $($docs.Count) documento(s)."
