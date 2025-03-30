// Mock de banco de dados usando localStorage para simulação
// Em um ambiente real, utilizaria um SQLite com conexão via Node.js ou um serviço de banco de dados

// Chave para armazenamento no localStorage
const STORAGE_KEY = 'ordem_servico_data';
const SAVED_DOCUMENTS_KEY = 'ordem_servico_saved_documents';

/**
 * Inicializa o banco de dados
 * @returns {boolean} - Sucesso da inicialização
 */
export const initDB = () => {
    try {
        // Verifica se já existe algum dado salvo
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
        }

        // Inicializa a lista de documentos salvos, se não existir
        if (!localStorage.getItem(SAVED_DOCUMENTS_KEY)) {
            localStorage.setItem(SAVED_DOCUMENTS_KEY, JSON.stringify({}));
        }

        return true;
    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
        return false;
    }
};

/**
 * Salva os dados do formulário no banco de dados temporário
 * @param {Object} data - Dados do formulário
 * @returns {boolean} - Sucesso da operação
 */
export const saveFormData = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        return false;
    }
};

/**
 * Obtém os dados salvos no banco de dados temporário
 * @returns {Object|null} - Dados salvos ou null em caso de erro
 */
export const getFormData = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Erro ao obter dados:', error);
        return null;
    }
};

/**
 * Salva o documento finalizando-o e adicionando à lista de documentos
 * @param {Object} document - Documento a ser salvo
 * @returns {Object} - Resultado da operação com ID do documento
 */
export const saveDocument = (document) => {
    try {
        const documentId = generateDocumentId();
        const savedDocuments = JSON.parse(localStorage.getItem(SAVED_DOCUMENTS_KEY)) || {};

        // Adiciona data e hora de salvamento
        const documentToSave = {
            ...document,
            dataSalvamento: new Date().toISOString(),
            id: documentId
        };

        savedDocuments[documentId] = documentToSave;
        localStorage.setItem(SAVED_DOCUMENTS_KEY, JSON.stringify(savedDocuments));

        return {
            success: true,
            documentId: documentId
        };
    } catch (error) {
        console.error('Erro ao salvar documento:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Obtém todos os documentos salvos
 * @returns {Array} - Lista de documentos salvos
 */
export const getAllDocuments = () => {
    try {
        const savedDocuments = JSON.parse(localStorage.getItem(SAVED_DOCUMENTS_KEY)) || {};
        return Object.values(savedDocuments);
    } catch (error) {
        console.error('Erro ao obter documentos salvos:', error);
        return [];
    }
};

/**
 * Obtém um documento específico pelo ID
 * @param {string} id - ID do documento a ser recuperado
 * @returns {Object|null} - Documento recuperado ou null em caso de erro
 */
export const getDocumentById = (id) => {
    try {
        const savedDocuments = JSON.parse(localStorage.getItem(SAVED_DOCUMENTS_KEY)) || {};
        return savedDocuments[id] || null;
    } catch (error) {
        console.error('Erro ao obter documento:', error);
        return null;
    }
};

/**
 * Função para limpar todos os dados (apenas para testes)
 */
export const clearDatabase = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SAVED_DOCUMENTS_KEY);
        return true;
    } catch (error) {
        console.error('Erro ao limpar banco de dados:', error);
        return false;
    }
};

// Gera um ID único para o documento
const generateDocumentId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}; 