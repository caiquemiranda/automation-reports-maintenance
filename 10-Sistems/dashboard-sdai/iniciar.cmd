@echo off
rem Inicia o IBSystems SDAI (backend + dashboard) e abre o navegador.
rem Duplo clique neste arquivo. Para encerrar: Ctrl+C ou feche esta janela.
title IBSystems SDAI
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado. Instale o Node 22.13 ou mais novo em https://nodejs.org
  pause
  exit /b 1
)

node scripts\start.mjs %*
if errorlevel 1 pause
