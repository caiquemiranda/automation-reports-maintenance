import React, { useRef, useEffect } from 'react';

function SummernoteEditor({ initialContent = '', onSave, onClose }) {
    const editorRef = useRef(null);

    useEffect(() => {
        function tryInit() {
            if (window.$ && window.$.fn && window.$.fn.summernote) {
                window.$(editorRef.current).summernote({
                    placeholder: 'Digite seu texto...',
                    tabsize: 2,
                    height: 200,
                    toolbar: [
                        ['style', ['style']],
                        ['font', ['bold', 'italic', 'underline', 'clear']],
                        ['fontname', ['fontname']],
                        ['fontsize', ['fontsize']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['height', ['height']],
                        ['insert', ['link', 'picture']],
                        ['view', ['undo', 'redo', 'fullscreen', 'codeview']]
                    ]
                });
                if (initialContent) {
                    window.$(editorRef.current).summernote('code', initialContent);
                }
            } else {
                setTimeout(tryInit, 100);
            }
        }
        tryInit();
        const currentRef = editorRef.current;
        return () => {
            if (window.$ && window.$.fn && window.$.fn.summernote) {
                window.$(currentRef).summernote('destroy');
            }
        };
    }, [initialContent]);

    const handleSave = () => {
        const html = window.$(editorRef.current).summernote('code');
        onSave(html);
    };

    return (
        <>
            <div ref={editorRef} />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={handleSave} style={{ marginRight: 8 }}>Salvar</button>
                <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            </div>
        </>
    );
}

export default SummernoteEditor; 