import React from 'react';
import './ActionButton.css';

const ActionButton = ({
    children,
    onClick,
    className = '',
    ...props
}) => {
    return (
        <button
            className={`action-button ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default ActionButton; 