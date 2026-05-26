
import React, { useState, useEffect } from 'react';
import CommentItem from './CommentItem';

interface CommentSectionProps {
    tweetId: number;
    idDonoDoTweet: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ tweetId, idDonoDoTweet }) => {
    const [comentarios, setComentarios] = useState<any[]>([]);
    const [novoTexto, setNovoTexto] = useState('');
    const token = localStorage.getItem('token');

    const carregarComentarios = async () => {
        try {
            const response = await fetch(`http://localhost:3000/comments/tweets/${tweetId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setComentarios(data);
            }
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        carregarComentarios();
    }, [tweetId]);

    const handleEnviar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!novoTexto) return;

        try {
            const response = await fetch(`http://localhost:3000/comments/tweets/${tweetId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ texto: novoTexto })
            });

            if (response.ok) {
                setNovoTexto('');
                carregarComentarios(); // Recarrega a lista local
            }
        } catch (error) { console.error(error); }
    };

    return (
        <div style={{ marginTop: '15px', paddingLeft: '15px', borderLeft: '2px solid #eee' }}>
            <form onSubmit={handleEnviar} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input type="text" value={novoTexto} onChange={(e) => setNovoTexto(e.target.value)} placeholder="Escreva um comentário..." style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
                <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#1d9bf0', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Comentar</button>
            </form>

            {comentarios.map(c => (
                <CommentItem key={c.id} comentario={c} idDonoDoTweet={idDonoDoTweet} onRefresh={carregarComentarios} />
            ))}
        </div>
    );
};

export default CommentSection;
