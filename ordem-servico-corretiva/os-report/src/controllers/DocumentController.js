import api from '../services/api';

/**
 * Controller para gerenciar as operações de documentos
 */
class DocumentController {
    /**
     * Lista todos os documentos disponíveis
     * @returns {Promise<Array>} Lista de documentos
     */
    async listDocuments() {
        try {
            console.log('[DocumentController] Listando documentos');
            const response = await api.get('/documentos');
            console.log('[DocumentController] Documentos encontrados:', response.data);
            return response.data;
        } catch (error) {
            console.error('[DocumentController] Erro ao listar documentos:', error);
            throw error;
        }
    }

    /**
     * Busca um documento pelo ID
     * @param {number} id - ID do documento
     * @returns {Promise<Object>} Documento encontrado
     */
    async getDocumentById(id) {
        try {
            console.log(`[DocumentController] Buscando documento com ID: ${id}`);
            const response = await api.get(`/documentos/${id}`);
            console.log('[DocumentController] Documento encontrado:', response.data);
            return response.data;
        } catch (error) {
            console.error(`[DocumentController] Erro ao buscar documento com ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Busca um documento pelo número da OS
     * @param {string} osNumber - Número da OS
     * @returns {Promise<Object>} Documento encontrado ou null se não encontrado
     */
    async getDocumentByOsNumber(osNumber) {
        try {
            console.log(`[DocumentController] Buscando documento com OS: ${osNumber}`);
            const response = await api.get(`/documentos`, {
                params: { os_number: osNumber }
            });

            if (response.data && response.data.length > 0) {
                console.log(`[DocumentController] Documento encontrado para OS ${osNumber}:`, response.data[0]);
                return response.data[0];
            }

            console.log(`[DocumentController] Nenhum documento encontrado para OS ${osNumber}`);
            return null;
        } catch (error) {
            console.error(`[DocumentController] Erro ao buscar documento com OS ${osNumber}:`, error);
            return null;
        }
    }

    /**
     * Salva um novo documento
     * @param {Object} documentData - Dados do documento a ser salvo
     * @returns {Promise<Object>} Documento salvo
     */
    async saveDocument(documentData) {
        try {
            console.log('[DocumentController] Salvando documento:', documentData);

            // Verifica se já existe um documento com este número de OS
            const existingDoc = await this.getDocumentByOsNumber(documentData.osNumber);

            let response;
            if (existingDoc) {
                // Atualiza o documento existente
                console.log(`[DocumentController] Atualizando documento existente com ID ${existingDoc.id}`);
                response = await api.put(`/documentos/${existingDoc.id}`, documentData);
            } else {
                // Cria um novo documento
                console.log('[DocumentController] Criando novo documento');
                response = await api.post('/documentos', documentData);
            }

            console.log('[DocumentController] Documento salvo com sucesso:', response.data);
            return response.data;
        } catch (error) {
            console.error('[DocumentController] Erro ao salvar documento:', error);
            throw error;
        }
    }

    /**
     * Atualiza um documento existente
     * @param {number} id - ID do documento
     * @param {Object} documentData - Novos dados do documento
     * @returns {Promise<Object>} Documento atualizado
     */
    async updateDocument(id, documentData) {
        try {
            console.log(`[DocumentController] Atualizando documento com ID ${id}:`, documentData);
            const response = await api.put(`/documentos/${id}`, documentData);
            console.log('[DocumentController] Documento atualizado com sucesso:', response.data);
            return response.data;
        } catch (error) {
            console.error(`[DocumentController] Erro ao atualizar documento com ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Exclui um documento
     * @param {number} id - ID do documento a ser excluído
     * @returns {Promise<void>}
     */
    async deleteDocument(id) {
        try {
            console.log(`[DocumentController] Excluindo documento com ID ${id}`);
            await api.delete(`/documentos/${id}`);
            console.log(`[DocumentController] Documento com ID ${id} excluído com sucesso`);
        } catch (error) {
            console.error(`[DocumentController] Erro ao excluir documento com ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Envia um arquivo para o servidor
     * @param {File} file - Arquivo a ser enviado
     * @param {number} documentId - ID do documento relacionado
     * @returns {Promise<Object>} Informações do arquivo enviado
     */
    async uploadFile(file, documentId) {
        try {
            console.log(`[DocumentController] Enviando arquivo para documento com ID ${documentId}:`, file.name);
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post(`/documentos/${documentId}/anexos`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('[DocumentController] Arquivo enviado com sucesso:', response.data);
            return response.data;
        } catch (error) {
            console.error(`[DocumentController] Erro ao enviar arquivo para documento com ID ${documentId}:`, error);
            throw error;
        }
    }
}

export default new DocumentController(); 