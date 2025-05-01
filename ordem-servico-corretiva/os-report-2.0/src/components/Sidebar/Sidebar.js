import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    return (
        <aside className={`sidebar${open ? '' : ' collapsed'}`}>
            <button className="sidebar-toggle" onClick={() => setOpen(o => !o)}>
                {open ? '⮜' : '⮞'}
            </button>
            {open && (
                <div className="sidebar-btns">
                    <button className="sidebar-btn">Salvar documento</button>
                    <button className="sidebar-btn">Editar documento</button>
                    <button className="sidebar-btn">Preview documento</button>
                </div>
            )}
        </aside>
    );
};

export default Sidebar; 