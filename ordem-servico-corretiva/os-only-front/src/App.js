import React from 'react';
import './App.css';
import { OrdemServicoProvider } from './contexts/OrdemServicoContext';
import OrdemServico from './pages/OrdemServico';

function App() {
    return (
        <OrdemServicoProvider>
            <OrdemServico />
        </OrdemServicoProvider>
    );
}

export default App; 