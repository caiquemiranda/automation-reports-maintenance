import React from 'react';

const SelectAutocomplete = ({ options, value, onChange, placeholder, datalistId }) => {
  return (
    <>
      <input
        list={datalistId}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ padding: 4, borderRadius: 4, border: '1px solid #ccc', width: '100%' }}
      />
      <datalist id={datalistId}>
        {options.map(opt => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
    </>
  );
};

export default SelectAutocomplete; 