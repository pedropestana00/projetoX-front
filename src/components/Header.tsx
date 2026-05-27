import React from 'react';

const Header: React.FC = () => {
    return (
        <header style={{ backgroundColor: '#1DA1F2', padding: '10px 20px', color: 'white', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
            <h1 style={{ margin: 0, fontSize: '24px' }}> Projeto X </h1>
        </header>
    );
};

export default Header;