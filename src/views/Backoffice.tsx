import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Backoffice: React.FC = () => {
    const [tweets, setTweets] = useState<any[]>([]);
    
    // ESTADOS PARA GERIR TWEETS
    const [editingTweetId, setEditingTweetId] = useState<number | null>(null);
    const [editTweetText, setEditTweetText] = useState('');
    // ESTADOS PARA GERIR UTILIZADORES
    const [utilizadores, setUtilizadores] = useState<any[]>([]);
    const [modo, setModo] = useState<'tweets' | 'utilizadores'>('tweets'); // Controlo de abas
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editUsername, setEditUsername] = useState('');
    const [editEmail, setEditEmail] = useState('');

    const token = localStorage.getItem('token');

    const carregarTodosTweets = async () => {
        try {
            const response = await fetch(`${API_URL}/tweets/global`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setTweets(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const carregarUtilizadores = async () => {
        try {
            const response = await fetch(`${API_URL}/user`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUtilizadores(data);
            }
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        carregarTodosTweets();
        carregarUtilizadores();
    }, []);

    // --- FUNÇÃO PARA GUARDAR A EDIÇÃO ---
    const handleEditarTweet = async (id_tweet: number) => {
        if (!editTweetText.trim()) return;

        try {
            // Comunica com o teu Back-end passando o ID correto do tweet
            const response = await fetch(`${API_URL}/tweets/${id_tweet}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ texto: editTweetText })
            });

            if (response.ok) {
                setEditingTweetId(null); // Fecha o campo de edição
                carregarTodosTweets();   // Atualiza a tabela com o texto novo
            } else {
                alert('Erro ao atualizar o tweet.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEliminarTweet = async (id: number) => {
        if (!window.confirm('Tem a certeza de que deseja eliminar este tweet permanentemente para moderação?')) return;

        try {
            const response = await fetch(`${API_URL}/tweets/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert('Tweet eliminado pelo administrador.');
                carregarTodosTweets();
            } else {
                alert('Erro ao eliminar o tweet.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // --- ATUALIZAR UTILIZADOR ---
    const handleEditarUtilizador = async (id_utilizador: number) => {
        if (!editUsername.trim() || !editEmail.trim()) return;
        try {
            const response = await fetch(`${API_URL}/user/${id_utilizador}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username: editUsername, email: editEmail })
            });
            if (response.ok) {
                setEditingUserId(null);
                carregarUtilizadores();
                carregarTodosTweets(); // Atualiza os autores na tabela de tweets
            } else {
                alert('Erro ao atualizar o utilizador.');
            }
        } catch (error) { console.error(error); }
    };

    // --- ELIMINAR UTILIZADOR ---
    const handleEliminarUtilizador = async (id_utilizador: number) => {
        if (!window.confirm('Tem a certeza de que deseja excluir este utilizador? Todas as suas publicações serão removidas.')) return;
        try {
            const response = await fetch(`${API_URL}/user/${id_utilizador}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                alert('Utilizador excluído com sucesso.');
                carregarUtilizadores();
                carregarTodosTweets();
            } else {
                alert('Erro ao excluir o utilizador.');
            }
        } catch (error) { console.error(error); }
    };

    return (
    <div style={{ display: 'flex', fontFamily: 'Arial' }}>
        <Navbar />
        <div style={{ marginLeft: '270px', padding: '20px', width: '950px' }}>
            
            {/* BOTÕES SUPERIORES DE ALTERNAÇÃO DE ABAS */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button 
                    onClick={() => setModo('tweets')}
                    style={{ padding: '10px 20px', backgroundColor: modo === 'tweets' ? 'red' : '#e1e8ed', color: modo === 'tweets' ? 'white' : '#333', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    🐦 Moderar Tweets
                </button>
                <button 
                    onClick={() => setModo('utilizadores')}
                    style={{ padding: '10px 20px', backgroundColor: modo === 'utilizadores' ? '#1d9bf0' : '#e1e8ed', color: modo === 'utilizadores' ? 'white' : '#333', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    👥 Gerir Utilizadores
                </button>
            </div>

            {/* ABA 1: MODERAÇÃO DE TWEETS */}
            {modo === 'tweets' && (
                <>
                    <h2 style={{ color: 'red', borderBottom: '2px solid red', paddingBottom: '10px' }}>🛡️ Painel de Moderação (Backoffice)</h2>
                    <p>Como administrador, pode ler, editar ou remover qualquer publicação abusiva da plataforma.</p>
                    
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Autor</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Conteúdo do Tweet</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Data</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tweets.map(t => (
                                <tr key={t.id_tweet} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>@{t.utilizador?.username || 'utilizador'}</td>
                                    
                                    <td style={{ padding: '12px', maxWidth: '300px' }}>
                                        {editingTweetId === t.id_tweet ? (
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <input 
                                                    type="text" 
                                                    value={editTweetText} 
                                                    onChange={(e) => setEditTweetText(e.target.value)}
                                                    style={{ flex: 1, padding: '5px' }}
                                                />
                                                <button onClick={() => handleEditarTweet(t.id_tweet)} style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '5px 8px', cursor: 'pointer', borderRadius: '3px' }}>✓</button>
                                                <button onClick={() => setEditingTweetId(null)} style={{ backgroundColor: 'gray', color: 'white', border: 'none', padding: '5px 8px', cursor: 'pointer', borderRadius: '3px' }}>X</button>
                                            </div>
                                        ) : (
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{t.texto}</span>
                                        )}
                                    </td>

                                    <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>
                                        {t.data_publicacao ? new Date(t.data_publicacao).toLocaleDateString() : '---'}
                                    </td>
                                    
                                    <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                                        {editingTweetId !== t.id_tweet && (
                                            <button 
                                                onClick={() => { setEditingTweetId(t.id_tweet); setEditTweetText(t.texto); }} 
                                                style={{ backgroundColor: 'orange', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                Editar
                                            </button>
                                        )}

                                        <button 
                                            onClick={() => handleEliminarTweet(t.id_tweet)} 
                                            style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {/* ABA 2: GESTÃO DE UTILIZADORES */}
            {modo === 'utilizadores' && (
                <>
                    <h2 style={{ color: '#1d9bf0', borderBottom: '2px solid #1d9bf0', paddingBottom: '10px' }}>👥 Controlo e Gestão de Utilizadores</h2>
                    <p>Como administrador, pode visualizar, editar dados ou remover contas da plataforma.</p>
                    
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                                <th style={{ padding: '12px', border: '1px solid #ddd', width: '10%' }}>ID</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd', width: '30%' }}>Username</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd', width: '35%' }}>Email</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd', width: '25%' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {utilizadores.map(u => (
                                <tr key={u.id_utilizador} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>#{u.id_utilizador}</td>
                                    
                                    <td style={{ padding: '12px' }}>
                                        {editingUserId === u.id_utilizador ? (
                                            <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} style={{ padding: '5px', width: '90%' }} />
                                        ) : (
                                            <span>@{u.username}</span>
                                        )}
                                    </td>

                                    <td style={{ padding: '12px' }}>
                                        {editingUserId === u.id_utilizador ? (
                                            <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} style={{ padding: '5px', width: '90%' }} />
                                        ) : (
                                            <span>{u.email}</span>
                                        )}
                                    </td>

                                    <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                                        {editingUserId === u.id_utilizador ? (
                                            <>
                                                <button onClick={() => handleEditarUtilizador(u.id_utilizador)} style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar</button>
                                                <button onClick={() => setEditingUserId(null)} style={{ backgroundColor: 'gray', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>X</button>
                                            </>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={() => { setEditingUserId(u.id_utilizador); setEditUsername(u.username); setEditEmail(u.email); }} 
                                                    style={{ backgroundColor: 'orange', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    Editar
                                                </button>
                                                {u.username !== 'admin' && (
                                                    <button 
                                                        onClick={() => handleEliminarUtilizador(u.id_utilizador)} 
                                                        style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                    >
                                                        Eliminar
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    </div>    
    );
};

export default Backoffice;

