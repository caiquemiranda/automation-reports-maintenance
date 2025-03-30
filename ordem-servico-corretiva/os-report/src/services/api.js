import axios from 'axios';

// Configuração do axios
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Serviços para documentos
export const documentosService = {
    /**
     * Lista todos os documentos
     * @param {number} skip - Número de documentos para pular
     * @param {number} limit - Limite de documentos a retornar
     * @returns {Promise} - Promessa com os documentos
     */
    listarDocumentos: async (skip = 0, limit = 100) => {
        try {
            const response = await api.get(`/documentos?skip=${skip}&limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao listar documentos:', error);
            throw error;
        }
    },

    /**
     * Obtém um documento pelo ID
     * @param {string} id - ID do documento
     * @returns {Promise} - Promessa com o documento
     */
    obterDocumento: async (id) => {
        try {
            const response = await api.get(`/documentos/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao obter documento:', error);
            throw error;
        }
    },

    /**
     * Cria um novo documento
     * @param {Object} documento - Dados do documento
     * @returns {Promise} - Promessa com o documento criado
     */
    criarDocumento: async (documento) => {
        try {
            const response = await api.post('/documentos', documento);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar documento:', error);
            throw error;
        }
    },

    /**
     * Atualiza um documento existente
     * @param {string} id - ID do documento
     * @param {Object} documento - Dados do documento
     * @returns {Promise} - Promessa com o documento atualizado
     */
    atualizarDocumento: async (id, documento) => {
        try {
            const response = await api.put(`/documentos/${id}`, documento);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar documento:', error);
            throw error;
        }
    },

    /**
     * Exclui um documento
     * @param {string} id - ID do documento
     * @returns {Promise} - Promessa com status da operação
     */
    excluirDocumento: async (id) => {
        try {
            const response = await api.delete(`/documentos/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao excluir documento:', error);
            throw error;
        }
    },

    /**
     * Filtrar documentos
     * @param {Object} filtros - Critérios de filtragem
     * @param {number} skip - Número de documentos para pular
     * @param {number} limit - Limite de documentos a retornar
     * @returns {Promise} - Promessa com os documentos filtrados
     */
    filtrarDocumentos: async (filtros, skip = 0, limit = 100) => {
        try {
            const response = await api.post(`/documentos/filtrar?skip=${skip}&limit=${limit}`, filtros);
            return response.data;
        } catch (error) {
            console.error('Erro ao filtrar documentos:', error);
            throw error;
        }
    }
};

// Serviços para anexos
export const anexosService = {
    /**
     * Adiciona um anexo a um documento
     * @param {string} documentoId - ID do documento
     * @param {File} arquivo - Arquivo a ser anexado
     * @param {string} descricao - Descrição do anexo
     * @returns {Promise} - Promessa com o anexo criado
     */
    adicionarAnexo: async (documentoId, arquivo, descricao) => {
        try {
            const formData = new FormData();
            formData.append('arquivo', arquivo);
            if (descricao) {
                formData.append('descricao', descricao);
            }

            const response = await api.post(`/documentos/${documentoId}/anexos`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao adicionar anexo:', error);
            throw error;
        }
    },

    /**
     * Exclui um anexo
     * @param {string} documentoId - ID do documento
     * @param {string} anexoId - ID do anexo
     * @returns {Promise} - Promessa com status da operação
     */
    excluirAnexo: async (documentoId, anexoId) => {
        try {
            const response = await api.delete(`/documentos/${documentoId}/anexos/${anexoId}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao excluir anexo:', error);
            throw error;
        }
    }
};

export default api; 