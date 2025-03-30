const handleSaveDocument = async (saveToDatabase = false) => {
    console.log('[DEBUG] Salvando documento:', {
        osNumber, saveToDatabase, currentDocumentId,
        indexedDBData: formState
    });

    try {
        // Verificar se temos um número de OS válido
        if (!osNumber || osNumber.trim() === '') {
            toastError('Por favor, insira um número de OS válido antes de salvar');
            setOsError(true);
            setFormErrors(prev => ({ ...prev, osNumber: 'Número de OS é obrigatório' }));
            return;
        }

        // ... existing code ...
    } catch (error) {
        console.error('[ERROR] Erro ao salvar documento:', error);
        toastError('Erro ao salvar documento: ' + errorToString(error));
    }
}; 