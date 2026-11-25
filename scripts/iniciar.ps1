
# ==========================================
# INICIAR SERVICIOS - SAZON URBANO
# ==========================================

Write-Host "Iniciando servicios de Sazon Urbano..." -ForegroundColor Cyan

# Ubicarse en la carpeta principal del proyecto
$proyecto = Split-Path $PSScriptRoot -Parent
Set-Location $proyecto

# Iniciar todos los servicios
docker compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "Servicios iniciados correctamente." -ForegroundColor Green
    docker compose ps
} else {
    Write-Host "Error al iniciar los servicios." -ForegroundColor Red
    exit 1
}
