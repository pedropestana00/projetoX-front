import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginRegister: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const endpoint = isLogin ? '/user/login' : '/user/register';
        
        const bodyData = isLogin 
            ? { username, password } 
            : { username, email, password };

        try {
            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.erro || 'Ocorreu um erro.');
                return;
            }

            if (isLogin) {
                // 1. Guarda o Token no navegador
                localStorage.setItem('token', data.token);
                
                // 2. CORREÇÃO DE MAPEAMENTO: Uniformiza 'admin' da API para 'is_admin' usado nos cartões
                const utilizadorNormalizado = {
                    id: data.user.id,
                    username: data.user.username,
                    is_admin: data.user.admin // Guarda true ou false de forma explícita
                };
                localStorage.setItem('user', JSON.stringify(utilizadorNormalizado));
                
                // 3. REDIRECIONAMENTO DINÂMICO: Se for Admin vai para o Backoffice, se não vai para o Feed
                if (utilizadorNormalizado.is_admin === true) {
                    navigate('/backoffice');
                } else {
                    navigate('/'); // Encaminha o utilizador padrão para a página inicial
                }
            } else {
                alert('Registo efetuado com sucesso! Faça login.');
                setIsLogin(true);
                setEmail('');
                setPassword('');
            }
        } catch (error) {
            console.error('Erro na ligação à API:', error);
            alert('Erro ao ligar ao servidor.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', fontFamily: 'Arial' }}>
            <h2>{isLogin ? 'Iniciar Sessão' : 'Criar Conta'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    style={{ padding: '10px' }}
                />
                
                {!isLogin && (
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ padding: '10px' }}
                    />
                )}

                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ padding: '10px' }}
                />

                <button type="submit" style={{ padding: '10px', backgroundColor: '#1d9bf0', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {isLogin ? 'Entrar' : 'Registar'}
                </button>
            </form>

            <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'} {' '}
                <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#1d9bf0', cursor: 'pointer', fontWeight: 'bold' }}>
                    {isLogin ? 'Registe-se aqui' : 'Faça login aqui'}
                </span>
            </p>
        </div>
    );
};

export default LoginRegister;

