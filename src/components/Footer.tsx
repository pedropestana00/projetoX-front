import React from "react";

const Footer: React.FC = () => {
    return (
        <footer style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', marginTop: '20px' }}> 
            <p style={{ color: '#777', fontSize: '14px' }}> © {new Date().getFullYear()} My App. All rights reserved. </p> 
        </footer> 
    ); 
}; 

export default Footer; 