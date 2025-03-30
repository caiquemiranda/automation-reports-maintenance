import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
    // Obter do localStorage
    const getStorageValue = () => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Erro ao buscar dados do localStorage:', error);
            return initialValue;
        }
    };

    // Estado para armazenar o valor atual
    const [value, setValue] = useState(getStorageValue);

    // Atualizar localStorage quando o valor mudar
    useEffect(() => {
        try {
            console.log(`Salvando no localStorage: ${key}`, value);
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
        }
    }, [key, value]);

    return [value, setValue];
}

export default useLocalStorage; 