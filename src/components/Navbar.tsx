import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    
    // Recupera a role do utilizador para saber se mostra o Backoffice
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const isAdmin = user.is_admin === true ;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav style={{ width: '250px', padding: '20px', borderRight: '1px solid #ccc', height: '100vh', position: 'fixed' }}>
            <h2>Rede Social</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ margin: '20px 0' }}><Link to="/">🏠 Página Inicial</Link></li>
                <li style={{ margin: '20px 0' }}><Link to="/explore">🌐 Explorar</Link></li>
                
                {/* Mostra o link apenas se for Administrador */}
                {isAdmin && (
                    <li style={{ margin: '20px 0' }}><Link to="/backoffice" style={{ color: 'red', fontWeight: 'bold' }}>🛡️ Backoffice</Link></li>
                )}
            </ul>
            <button onClick={handleLogout} style={{ marginTop: '50px', padding: '10px', width: '100%', cursor: 'pointer', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px' }}>
                Sair da Conta
            </button>
        </nav>
    );
};

export default Navbar;
