
# ==========================================
# DETENER SERVICIOS - SAZON URBANO
# ==========================================

Write-Host "Deteniendo servicios de Sazon Urbano..." -ForegroundColor Yellow

# Ubicarse en la carpeta principal
$proyecto = Split-Path $PSScriptRoot -Parent
Set-Location $proyecto

# Detener los contenedores sin eliminar datos
docker compose stop

if ($LASTEXITCODE -eq 0) {
    Write-Host "Servicios detenidos correctamente." -ForegroundColor Green
} else {
    Write-Host "Error al detener los servicios." -ForegroundColor Red
    exit 1
}
