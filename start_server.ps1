# Script para iniciar backend (FastAPI) + frontend (Next.js) em 1 comando
$ErrorActionPreference = 'Stop'

$root = $PSScriptRoot

function Resolve-BackendDir {
	$candidates = @(
		$root,
		(Join-Path $root 'detran-main')
	)

	foreach ($dir in $candidates) {
		if (Test-Path (Join-Path $dir 'api_server.py')) {
			return $dir
		}
	}

	throw "Não foi possível localizar api_server.py em: $($candidates -join ', ')"
}

function Resolve-FrontendDir {
	$candidates = @(
		(Join-Path $root 'frontend'),
		(Join-Path $root 'detran-main\frontend')
	)

	foreach ($dir in $candidates) {
		if (Test-Path (Join-Path $dir 'package.json')) {
			return $dir
		}
	}

	throw "Não foi possível localizar frontend/package.json em: $($candidates -join ', ')"
}

function Resolve-PythonExe {
	param([string]$BackendDir)

	$candidates = @(
		(Join-Path $root '.venv\Scripts\python.exe'),
		(Join-Path $root 'venv\Scripts\python.exe'),
		(Join-Path $BackendDir '.venv\Scripts\python.exe'),
		(Join-Path $BackendDir 'venv\Scripts\python.exe')
	)

	foreach ($exe in $candidates) {
		if (Test-Path $exe) {
			return $exe
		}
	}

	throw "Python do ambiente virtual não encontrado. Caminhos testados: $($candidates -join ', ')"
}

$backendDir = Resolve-BackendDir
$frontendDir = Resolve-FrontendDir
$pythonExe = Resolve-PythonExe -BackendDir $backendDir

if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
	throw "npm não encontrado no PATH. Instale Node.js ou abra um terminal com npm disponível."
}

Write-Host "Iniciando backend em: $backendDir" -ForegroundColor Cyan
Write-Host "Iniciando frontend em: $frontendDir" -ForegroundColor Cyan

$backendProcess = Start-Process -FilePath $pythonExe `
	-ArgumentList 'api_server.py' `
	-WorkingDirectory $backendDir `
	-PassThru

$frontendProcess = Start-Process -FilePath 'npm.cmd' `
	-ArgumentList 'run', 'dev' `
	-WorkingDirectory $frontendDir `
	-PassThru

Write-Host ''
Write-Host "Servicos iniciados" -ForegroundColor Green
Write-Host "Backend PID: $($backendProcess.Id)  URL: http://localhost:8000" -ForegroundColor Green
Write-Host "Frontend PID: $($frontendProcess.Id) URL: http://localhost:3000" -ForegroundColor Green
Write-Host ''
Write-Host 'Para encerrar:' -ForegroundColor Yellow
Write-Host "Stop-Process -Id $($backendProcess.Id),$($frontendProcess.Id)"
