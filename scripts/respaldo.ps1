
# ==========================================
# RESPALDO AUTOMATICO - SAZON URBANO
# ==========================================

$fecha = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$carpeta = Join-Path $PSScriptRoot "backups"

if (!(Test-Path $carpeta)) {
    New-Item -ItemType Directory -Path $carpeta | Out-Null
}

$archivo = Join-Path $carpeta "sazon_urbano_$fecha.sql"

Write-Host "Iniciando respaldo de Sazon Urbano..." -ForegroundColor Cyan

$estado = docker inspect -f '{{.State.Running}}' sazon_mysql 2>$null

if ($estado -ne "true") {
    Write-Host "ERROR: MySQL no esta activo." -ForegroundColor Red
    exit 1
}

# Crear respaldo sin requerir privilegio PROCESS
docker exec sazon_mysql sh -c 'MYSQL_PWD="$MYSQL_PASSWORD" mysqldump -u sazon_app --no-tablespaces --single-transaction sazon_urbano' | Out-File -FilePath $archivo -Encoding utf8

$codigo = $LASTEXITCODE

if ($codigo -eq 0 -and (Test-Path $archivo) -and (Get-Item $archivo).Length -gt 100) {
    Write-Host "Respaldo creado correctamente." -ForegroundColor Green
    Write-Host "Archivo: $archivo"
    Write-Host "Tamano: $((Get-Item $archivo).Length) bytes"
} else {
    Remove-Item $archivo -ErrorAction SilentlyContinue
    Write-Host "ERROR: El respaldo no se completo." -ForegroundColor Red
    exit 1
}
