import { useCallback } from 'react';

const useDocumentActions = () => {
    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    const handleSave = useCallback(() => {
        alert('Funcionalidade de salvar seria implementada aqui (ex: exportar para PDF)');
    }, []);

    return { handlePrint, handleSave };
};

export default useDocumentActions; 