# Script para iniciar o servidor API (backend FastAPI)
$ErrorActionPreference = 'Stop'

$root = $PSScriptRoot
$backendDir = Join-Path $root 'detran-main'
$pythonExe = Join-Path $root '.venv\Scripts\python.exe'

if (-not (Test-Path $backendDir)) {
	Write-Error "Pasta do backend não encontrada: $backendDir"
}

if (-not (Test-Path $pythonExe)) {
	Write-Error "Python do ambiente virtual não encontrado: $pythonExe"
}

Set-Location $backendDir
& $pythonExe api_server.py
