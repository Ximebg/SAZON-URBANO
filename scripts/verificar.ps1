
# ==========================================
# VERIFICAR SERVICIOS - SAZON URBANO
# ==========================================

Write-Host "VERIFICACION DE SAZON URBANO" -ForegroundColor Cyan
Write-Host "================================"

$proyecto = Split-Path $PSScriptRoot -Parent
Set-Location $proyecto

# Mostrar estado de los contenedores
docker compose ps

Write-Host "`nComprobando disponibilidad del backend..." -ForegroundColor Cyan

try {
    $respuesta = curl.exe -k -s https://localhost:8443/health | ConvertFrom-Json

    if ($respuesta.status -eq "healthy") {
        Write-Host "Backend: FUNCIONANDO" -ForegroundColor Green
        Write-Host "Estado: $($respuesta.status)"
    }
    else {
        Write-Host "Backend: RESPUESTA NO SALUDABLE" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "Backend: NO DISPONIBLE" -ForegroundColor Red
}