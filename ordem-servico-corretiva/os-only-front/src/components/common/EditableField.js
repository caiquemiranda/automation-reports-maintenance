import React from 'react';
import './EditableField.css';

const EditableField = ({
    value,
    onChange,
    className = '',
    html = false,
    ...props
}) => {
    const handleChange = (e) => {
        const newValue = html ? e.target.innerHTML : e.target.textContent;
        onChange(newValue);
    };

    return (
        <div
            className={`editable-field ${className}`}
            contentEditable={true}
            suppressContentEditableWarning={true}
            onBlur={handleChange}
            dangerouslySetInnerHTML={html ? { __html: value } : undefined}
            {...props}
        >
            {!html && value}
        </div>
    );
};

export default EditableField; 