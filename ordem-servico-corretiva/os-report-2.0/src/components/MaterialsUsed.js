import React, { useState } from 'react';
import './MaterialsUsed.css';

const DEFAULT_MATERIALS = [
    'Acionador simples modelo 2023/234',
    'Detector de fumaça convencional',
    'Cabos de conexão',
    'Fonte de alimentação',
    'Placa de circuito',
    'Parafusos e presilhas',
    'Componentes eletrônicos',
    'Peças de reposição',
];

const MaterialsUsed = ({ materials, setMaterials }) => {
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [customMaterial, setCustomMaterial] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [materialQuantity, setMaterialQuantity] = useState(1);

    const addMaterial = () => {
        const newMaterial = {
            name: showCustomInput ? customMaterial : selectedMaterial,
            quantity: materialQuantity
        };

        if (showCustomInput && customMaterial) {
            setMaterials([...materials, newMaterial]);
            setCustomMaterial('');
            setShowCustomInput(false);
        } else if (selectedMaterial) {
            setMaterials([...materials, newMaterial]);
            setSelectedMaterial('');
        }

        setMaterialQuantity(1);
    };

    const removeMaterial = (index) => {
        setMaterials(materials.filter((_, i) => i !== index));
    };

    const updateQuantity = (index, newQuantity) => {
        const updatedMaterials = [...materials];
        updatedMaterials[index] = {
            ...updatedMaterials[index],
            quantity: Math.max(1, newQuantity)
        };
        setMaterials(updatedMaterials);
    };

    return (
        <section className="materials-used">
            <h3>Materiais Utilizados</h3>
            <div className="materials-container">
                {materials.length > 0 ? (
                    <div className="materials-list">
                        <table className="materials-table">
                            <thead>
                                <tr>
                                    <th>Material</th>
                                    <th>Quantidade</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materials.map((material, index) => (
                                    <tr key={index} className="material-item">
                                        <td>{material.name || material}</td>
                                        <td className="quantity-cell">
                                            <div className="quantity-control">
                                                <button
                                                    type="button"
                                                    className="quantity-btn"
                                                    onClick={() => updateQuantity(index, (material.quantity || 1) - 1)}
                                                >
                                                    -
                                                </button>
                                                <span className="quantity-value">
                                                    {material.quantity || 1}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="quantity-btn"
                                                    onClick={() => updateQuantity(index, (material.quantity || 1) + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => removeMaterial(index)}
                                            >
                                                ×
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-materials">
                        Nenhum material utilizado.
                    </div>
                )}

                <div className="materials-add">
                    {showCustomInput ? (
                        <div className="custom-material-input">
                            <input
                                type="text"
                                value={customMaterial}
                                onChange={(e) => setCustomMaterial(e.target.value)}
                                placeholder="Digite o nome do material"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCustomInput(false)}
                                className="cancel-btn"
                            >
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <select
                            value={selectedMaterial}
                            onChange={(e) => setSelectedMaterial(e.target.value)}
                        >
                            <option value="">Selecione um material</option>
                            {DEFAULT_MATERIALS.map((material, index) => (
                                <option key={index} value={material}>
                                    {material}
                                </option>
                            ))}
                        </select>
                    )}

                    <div className="quantity-input">
                        <label>Quantidade:</label>
                        <input
                            type="number"
                            min="1"
                            value={materialQuantity}
                            onChange={(e) => setMaterialQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                    </div>

                    <div className="add-buttons">
                        <button
                            type="button"
                            onClick={addMaterial}
                            disabled={(showCustomInput && !customMaterial) || (!showCustomInput && !selectedMaterial)}
                            className="add-btn"
                        >
                            Adicionar
                        </button>

                        {!showCustomInput && (
                            <button
                                type="button"
                                onClick={() => setShowCustomInput(true)}
                                className="custom-btn"
                            >
                                Outro Material
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MaterialsUsed; 