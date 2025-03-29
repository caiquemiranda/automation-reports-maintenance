@echo off
echo Iniciando o sistema de Relatorios de Manutencao (Versao Web)
echo -----------------------------------------------------------

REM Verificar se o Docker está instalado
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Erro: Docker nao esta instalado.
    exit /b 1
)

REM Verificar se o Docker Compose está instalado
where docker-compose >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Erro: Docker Compose nao esta instalado.
    exit /b 1
)

REM Construir e iniciar os containers
echo Construindo e iniciando os containers...
docker-compose build
docker-compose up -d

REM Exibir informações de acesso
echo -----------------------------------------------------------
echo Sistema iniciado com sucesso!
echo Acesse o frontend em: http://localhost
echo Backend disponivel em: http://localhost:5000/api/health
echo.
echo Para parar o sistema, execute: docker-compose down
echo ----------------------------------------------------------- 