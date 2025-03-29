@echo off
echo Iniciando o sistema de Relatorios de Manutencao (Versao Desktop)
echo -------------------------------------------------------------

REM Verificar se o Docker está instalado
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Erro: Docker nao esta instalado.
    exit /b 1
)

REM Construir a imagem Docker
echo Construindo a imagem...
docker build -t maintenance-reports-desktop .

echo Executando no Windows...
echo Nota: Para executar aplicacoes GUI no Docker no Windows, pode ser necessario configurar um servidor X11.
echo Um servidor X como VcXsrv deve estar em execucao.

REM Tentativa de execução com interface gráfica
echo Tentando executar a aplicacao...
docker run --rm -it maintenance-reports-desktop

echo -------------------------------------------------------------
echo Aplicacao finalizada!
echo ------------------------------------------------------------- 