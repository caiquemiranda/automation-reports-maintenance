import React from 'react';

const MultiSelect = ({ options, selected, onChange, placeholder }) => {
    const handleAdd = (e) => {
        const value = e.target.value;
        if (value && !selected.includes(value)) {
            onChange([...selected, value]);
        }
        e.target.value = '';
    };

    const handleRemove = (tag) => {
        onChange(selected.filter(t => t !== tag));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
                {selected.map(tag => (
                    <span key={tag} style={{ background: '#e1f0fa', borderRadius: 4, padding: '2px 8px', display: 'inline-flex', alignItems: 'center' }}>
                        {tag}
                        <button type="button" onClick={() => handleRemove(tag)} style={{ marginLeft: 4, background: 'none', border: 'none', color: '#c00', cursor: 'pointer' }}>×</button>
                    </span>
                ))}
            </div>
            <input
                list="multiselect-options"
                placeholder={placeholder}
                onBlur={handleAdd}
                onKeyDown={e => { if (e.key === 'Enter') handleAdd(e); }}
                style={{ padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <datalist id="multiselect-options">
                {options.map(opt => (
                    <option key={opt} value={opt} />
                ))}
            </datalist>
        </div>
    );
};

export default MultiSelect; 