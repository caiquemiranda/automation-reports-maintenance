/**
 * Serviço para gerenciar o armazenamento de relatórios
 */

const REPORTS_STORAGE_KEY = 'model_reports_data';

export const StorageService = {
    /**
     * Salva um relatório no armazenamento local
     * @param {Object} report - O relatório a ser salvo
     */
    saveReport: (report) => {
        const reports = StorageService.getAllReports();

        // Se o relatório já existe, atualiza
        const existingIndex = reports.findIndex(r => r.id === report.id);
        if (existingIndex >= 0) {
            reports[existingIndex] = report;
        } else {
            // Adiciona um novo relatório
            reports.push(report);
        }

        // Salva no localStorage
        localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
        return report;
    },

    /**
     * Obtém todos os relatórios armazenados
     * @returns {Array} Lista de relatórios
     */
    getAllReports: () => {
        const reportsData = localStorage.getItem(REPORTS_STORAGE_KEY);
        if (!reportsData) {
            return [];
        }

        try {
            return JSON.parse(reportsData);
        } catch (e) {
            console.error('Erro ao parsear relatórios armazenados:', e);
            return [];
        }
    },

    /**
     * Obtém um relatório específico pelo ID
     * @param {string} id - ID do relatório
     * @returns {Object|null} O relatório ou null se não encontrado
     */
    getReportById: (id) => {
        const reports = StorageService.getAllReports();
        return reports.find(report => report.id === id) || null;
    },

    /**
     * Remove um relatório pelo ID
     * @param {string} id - ID do relatório
     * @returns {boolean} Verdadeiro se removido com sucesso
     */
    deleteReport: (id) => {
        const reports = StorageService.getAllReports();
        const filteredReports = reports.filter(report => report.id !== id);

        // Se o número for diferente, significa que encontrou e removeu
        if (filteredReports.length !== reports.length) {
            localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(filteredReports));
            return true;
        }

        return false;
    }
};

export default StorageService; 