@echo off
echo Conversor de Documentos DOC para HTML/PDF
echo =======================================

:: Verificar se Python está instalado
python --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Python nao encontrado! Por favor, instale o Python 3.6 ou superior.
    echo Acesse: https://www.python.org/downloads/
    pause
    exit /b 1
)

:: Verificar se as dependências estão instaladas
echo Verificando dependencias...
pip show flask mammoth pdfkit > nul 2>&1
if %errorlevel% neq 0 (
    echo Instalando dependencias...
    pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo Falha ao instalar dependencias!
        pause
        exit /b 1
    )
)

echo.
echo Selecione uma opcao:
echo 1. Executar interface web (para editar o documento)
echo 2. Converter documento para HTML e PDF (sem edicao)
echo 3. Processar multiplos documentos DOC em lote
echo.

set /p opcao="Digite o numero da opcao desejada: "

if "%opcao%"=="1" (
    echo.
    echo Iniciando interface web...
    python doc_converter.py
) else if "%opcao%"=="2" (
    echo.
    set /p arquivo="Digite o caminho do arquivo DOC (ou pressione ENTER para usar 'report.doc'): "
    
    if "%arquivo%"=="" set arquivo=report.doc
    
    echo.
    echo Convertendo %arquivo% para HTML e PDF...
    python doc_converter_cli.py "%arquivo%"
) else if "%opcao%"=="3" (
    echo.
    set /p padrao="Digite o padrao de arquivos DOC (ex: *.doc) ou pasta/padrao (ou pressione ENTER para usar '*.doc'): "
    
    if "%padrao%"=="" set padrao=*.doc
    
    echo.
    set /p pasta_saida="Digite o diretorio de saida (ou pressione ENTER para usar 'output'): "
    
    if "%pasta_saida%"=="" set pasta_saida=output
    
    echo.
    echo Processando arquivos %padrao% para a pasta %pasta_saida%...
    python batch_process.py "%padrao%" --output-dir "%pasta_saida%"
) else (
    echo.
    echo Opcao invalida!
)

echo.
pause 