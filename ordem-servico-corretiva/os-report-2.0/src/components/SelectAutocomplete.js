import React from 'react';

const SelectAutocomplete = ({ options, value, onChange, placeholder }) => {
  return (
    <input
      list="select-autocomplete-options"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ padding: 4, borderRadius: 4, border: '1px solid #ccc', width: '100%' }}
    />
    <datalist id="select-autocomplete-options">
      {options.map(opt => (
        <option key={opt} value={opt} />
      ))}
    </datalist>
  );
};

export default SelectAutocomplete; 