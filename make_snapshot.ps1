# ====== make_snapshot.ps1 (v2) ======
$ErrorActionPreference = 'Stop'

$OUT = 'frontend_snapshot.txt'

# Directorios a excluir
$excludeDirRegex = '(\\(node_modules|dist|build|coverage|\.git|\.next|\.turbo|\.cache|\.vercel|\.pnpm-store|\.yarn)(\\|$))'

# Excluir cualquier archivo .env (y variantes)
$excludeEnvRegex = '(\\|/)?\.env($|\.|\\|/)'

# Extensiones de texto que SÍ queremos
$includeExts = @(
  '.ts','.tsx','.js','.jsx','.mjs','.cjs',
  '.json','.css','.scss','.sass',
  '.html','.htm','.md','.txt',
  '.tsconfig','.yml','.yaml',
  '.config','.gitignore'
)

# Limpiar salida previa
Remove-Item $OUT -ErrorAction SilentlyContinue

"### PROJECT TREE (sin node_modules & artefactos)" | Set-Content $OUT -Encoding UTF8

# Árbol
Get-ChildItem -Recurse -Force |
  Where-Object { $_.FullName -notmatch $excludeDirRegex -and $_.FullName -notmatch $excludeEnvRegex } |
  ForEach-Object {
    $rel = Resolve-Path -LiteralPath $_.FullName -Relative
    if ($_.PSIsContainer) { "[DIR]  $rel" } else { "      $rel" }
  } |
  Sort-Object |
  Add-Content $OUT -Encoding UTF8

"`n`n### FILE CONTENTS" | Add-Content $OUT -Encoding UTF8

# Selección de archivos de texto
$files = Get-ChildItem -Recurse -File -Force |
  Where-Object {
    $_.FullName -notmatch $excludeDirRegex -and
    $_.FullName -notmatch $excludeEnvRegex -and
    $includeExts -contains $_.Extension.ToLower()
  }

# Diagnóstico
"`nArchivos seleccionados para volcado: $($files.Count)`n" | Add-Content $OUT -Encoding UTF8

if ($files.Count -eq 0) {
  "⚠️ No se detectaron archivos. Revisa los filtros o la ruta actual." | Add-Content $OUT -Encoding UTF8
  Write-Host "⚠️ 0 archivos seleccionados. Revisa filtros o carpeta actual."
  exit 0
}

# Volcado de contenidos
foreach ($f in $files) {
  $rel = Resolve-Path -LiteralPath $f.FullName -Relative
  "`n`n===== FILE: $rel =====" | Add-Content $OUT -Encoding UTF8
  try {
    Get-Content -Raw -LiteralPath $f.FullName | Add-Content $OUT -Encoding UTF8
  } catch {
    "⚠️ Error leyendo $rel : $($_.Exception.Message)" | Add-Content $OUT -Encoding UTF8
  }
}

"`n`n✅ Listo: $OUT" | Add-Content $OUT -Encoding UTF8
Write-Host "✅ Generado $OUT con $($files.Count) archivos."
# ====== fin ======