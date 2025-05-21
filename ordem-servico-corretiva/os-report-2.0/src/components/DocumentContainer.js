import React from 'react';
import './DocumentContainer.css';

const DocumentContainer = ({ children, isPreview }) => {
  return (
    <div className={`document-container ${isPreview ? 'preview-mode' : ''}`}>
      <div className="document-paper">
        {children}
      </div>
    </div>
  );
};

export default DocumentContainer; 