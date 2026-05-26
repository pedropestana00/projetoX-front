import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importação das Páginas (Views)
import LoginRegister from './views/LoginRegister';
import HomeFeed from './views/HomeFeed';
import ExploreFeed from './views/ExploreFeed';
import Backoffice from './views/Backoffice';

// Importação do Componente de Proteção de Rotas
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Rota Pública: Acessível sem login */}
                <Route path="/login" element={<LoginRegister />} />

                {/* Rotas Protegidas: Exigem Token JWT no localStorage */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <HomeFeed />
                    </ProtectedRoute>
                } />
                
                <Route path="/explore" element={
                    <ProtectedRoute>
                        <ExploreFeed />
                    </ProtectedRoute>
                } />

                {/* Rota do Backoffice: Acessível apenas para Administradores */}
                <Route path="/backoffice" element={
                    <ProtectedRoute>
                        <Backoffice />
                    </ProtectedRoute>
                } />

                {/* Redireciona qualquer URL inválido diretamente para a Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;

