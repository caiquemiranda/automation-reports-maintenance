/**
 * Serviço para gerenciar modelos de relatório (templates)
 */

const TEMPLATES_STORAGE_KEY = 'model_report_templates';

export const TemplateService = {
    /**
     * Salva ou atualiza um modelo
     * @param {Object} template - { id, title, content }
     */
    saveTemplate: (template) => {
        const templates = TemplateService.getAllTemplates();
        const idx = templates.findIndex(t => t.id === template.id);
        if (idx >= 0) {
            templates[idx] = template;
        } else {
            templates.push(template);
        }
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
        return template;
    },

    /**
     * Lista todos os modelos
     */
    getAllTemplates: () => {
        const data = localStorage.getItem(TEMPLATES_STORAGE_KEY);
        if (!data) return [];
        try {
            return JSON.parse(data);
        } catch {
            return [];
        }
    },

    /**
     * Busca um modelo pelo id
     */
    getTemplateById: (id) => {
        return TemplateService.getAllTemplates().find(t => t.id === id) || null;
    },

    /**
     * Exclui um modelo pelo id
     */
    deleteTemplate: (id) => {
        const templates = TemplateService.getAllTemplates();
        const filtered = templates.filter(t => t.id !== id);
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(filtered));
        return true;
    }
};

export default TemplateService; 