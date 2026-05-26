import React, { useState } from 'react';
import CommentSection from './CommentSection';

interface TweetCardProps {
    tweet: any;
    onRefresh: () => void;
}
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const TweetCard: React.FC<TweetCardProps> = ({ tweet, onRefresh }) => {
    const [showComments, setShowComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(tweet.texto);
    
    // Obtém o ID e permissões do utilizador logado
    const userString = localStorage.getItem('user');
    const me = userString ? JSON.parse(userString) : null;
    const token = localStorage.getItem('token');

    // CORREÇÃO AMPLIADA: Validação visual para o dono do tweet OU Administrador (cobre todas as variantes)
    const possoGerir = 
        me?.id === tweet.id_utilizador || 
        me?.is_admin === true || 
        me?.admin === true ||
        me?.is_admin === 1 ||
        me?.admin === 1;

    // Lógica para Salvar a Edição do Tweet
    const handleUpdate = async () => {
        if (!editText.trim()) return;
        try {
            const response = await fetch(`${API_URL}/tweets/${tweet.id_tweet}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ texto: editText })
            });
            if (response.ok) {
                setIsEditing(false);
                onRefresh();
            }
        } catch (error) { 
            console.error(error); 
        }
    };

    // Lógica para Eliminar o Tweet
    const handleDelete = async () => {
        if (!window.confirm('Deseja eliminar este tweet e todos os seus comentários associados?')) return;
        try {
            const response = await fetch(`${API_URL}/tweets/${tweet.id_tweet}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) onRefresh();
        } catch (error) { 
            console.error(error); 
        }
    };

    // Lógica de Toggle do Like (Insert/Delete)
    const handleLike = async () => {
        try {
            const response = await fetch(`${API_URL}/likes/tweets/${tweet.id_tweet}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) onRefresh();
        } catch (error) { console.error(error); }
    };

    // Lógica de Toggle do Follow (Insert/Delete)
    const handleFollow = async () => {
        try {
            const response = await fetch(`${API_URL}/follows/utilizadores/${tweet.id_utilizador}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) onRefresh();
        } catch (error) { console.error(error); }
    };

    return (
        <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '15px', marginBottom: '15px', backgroundColor: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>@{tweet.utilizador?.username}</strong>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {/* Botões de Ação Avançados (Dono do Tweet ou Admin) */}
                    {possoGerir && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => setIsEditing(!isEditing)} style={{ background: 'none', border: 'none', color: 'orange', cursor: 'pointer', fontSize: '13px' }}>
                                {isEditing ? 'Cancelar' : 'Editar'}
                            </button>
                            <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '13px' }}>
                                Eliminar
                            </button>
                        </div>
                    )}

                    {/* Só mostra o botão de Seguir se o tweet NÃO for meu */}
                    {me?.id !== tweet.id_utilizador && (
                        <button onClick={handleFollow} style={{ padding: '5px 12px', borderRadius: '15px', cursor: 'pointer', border: '1px solid #1d9bf0', backgroundColor: tweet.seguindoAutor === 1 ? '#1d9bf0' : '#fff', color: tweet.seguindoAutor === 1 ? '#fff' : '#1d9bf0' }}>
                            {tweet.seguindoAutor === 1 ? 'Seguindo' : 'Seguir'}
                        </button>
                    )}
                </div>
            </div>

            {/* Campo de Texto Dinâmico (Modo Leitura ou Modo Edição) */}
            {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    <textarea 
                        value={editText} 
                        onChange={(e) => setEditText(e.target.value)} 
                        maxLength={280}
                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', resize: 'vertical' }}
                    />
                    <button onClick={handleUpdate} style={{ backgroundColor: '#1d9bf0', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', alignSelf: 'flex-end', fontWeight: 'bold' }}>
                        Salvar Alterações
                    </button>
                </div>
            ) : (
                <p style={{ margin: '15px 0', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{tweet.texto}</p>
            )}

            {/* Renderiza a imagem estática do Multer caso ela exista */}
            {tweet.imagem && (
                <div style={{ marginBottom: '15px' }}>
                    <img src={`${API_URL}${tweet.imagem}`} alt="Imagem do tweet" style={{ maxWidth: '100%', borderRadius: '10px', maxHeight: '300px', objectFit: 'cover' }} />
                </div>
            )}

            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: tweet.deiLike === 1 ? 'red' : '#555' }}>
                    {tweet.deiLike === 1 ? '❤️ Gostou' : '🤍 Gostar'}
                </button>
                <button onClick={() => setShowComments(!showComments)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#1d9bf0' }}>
                    💬 Comentários
                </button>
            </div>

            {/* Secção de Comentários Expandível */}
            {showComments && <CommentSection tweetId={tweet.id_tweet} idDonoDoTweet={tweet.id_utilizador} />}
        </div>
    );
};

export default TweetCard;

