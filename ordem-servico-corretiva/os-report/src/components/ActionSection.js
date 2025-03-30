import React, { useState, useEffect } from 'react';

/**
 * Componente para a seção de ação corretiva
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.formData - Dados do formulário
 * @param {Function} props.handleInputChange - Função para atualizar os dados
 * @param {Array} props.actionItems - Lista de ações
 * @param {Function} props.setActionItems - Função para atualizar a lista de ações
 */
const ActionSection = ({ formData, handleInputChange, actionItems, setActionItems }) => {
    const [newItem, setNewItem] = useState('');

    // Inicializa com os itens padrão se não houver itens definidos
    useEffect(() => {
        if (!actionItems || actionItems.length === 0) {
            setActionItems([
                'Teste de formato',
                'Teste de comunicação com painel',
                'Funcionamento do detector'
            ]);
        }
    }, [actionItems, setActionItems]);

    const addItem = () => {
        if (newItem.trim()) {
            setActionItems([...actionItems, newItem.trim()]);
            setNewItem('');
        }
    };

    const removeItem = (index) => {
        const updatedItems = [...actionItems];
        updatedItems.splice(index, 1);
        setActionItems(updatedItems);
    };

    return (
        <div className="action-section">
            <div className="section-label">Ação Corretiva:</div>
            <div className="section-content">
                <textarea
                    className="form-control"
                    value={formData.acaoCorretiva}
                    onChange={(e) => handleInputChange('acaoCorretiva', e.target.value)}
                    placeholder="Descreva detalhadamente as ações realizadas para corrigir o problema"
                    required
                    rows={4}
                />

                <div className="action-items">
                    <h4>Ações realizadas:</h4>
                    <ul>
                        {actionItems.map((item, index) => (
                            <li key={index}>
                                {item}{' '}
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => removeItem(index)}
                                >
                                    x
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="add-item-form">
                        <input
                            type="text"
                            className="form-control"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder="Adicionar nova ação"
                        />
                        <button type="button" className="btn-action" onClick={addItem}>
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionSection; 