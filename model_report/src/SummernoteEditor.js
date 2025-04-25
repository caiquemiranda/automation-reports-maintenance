import React, { useRef, useEffect } from 'react';

function SummernoteEditor({ onSave, onClose }) {
  const editorRef = useRef(null);

  useEffect(() => {
    // Inicializa o Summernote
    window.$(editorRef.current).summernote({
      placeholder: 'Digite seu texto...',
      tabsize: 2,
      height: 200,
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'clear']],
        ['fontname', ['fontname']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],
        ['insert', ['link', 'picture']],
        ['view', ['undo', 'redo', 'fullscreen', 'codeview']]
      ]
    });
    const currentRef = editorRef.current;
    return () => {
      // Destroi o Summernote ao desmontar
      window.$(currentRef).summernote('destroy');
    };
  }, []);

  const handleSave = () => {
    const html = window.$(editorRef.current).summernote('code');
    onSave(html);
  };

  return (
    <div className="editor-modal">
      <div ref={editorRef} />
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <button className="btn btn-primary" onClick={handleSave} style={{ marginRight: 8 }}>Salvar</button>
        <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

export default SummernoteEditor; 