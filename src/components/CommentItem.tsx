import React, { useState } from 'react';

interface CommentItemProps {
    comentario: any;
    idDonoDoTweet: number; // Nova Prop: ID do utilizador que criou o tweet pai
    onRefresh: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CommentItem: React.FC<CommentItemProps> = ({ comentario, idDonoDoTweet, onRefresh }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comentario.texto);

    const userString = localStorage.getItem('user');
    const me = userString ? JSON.parse(userString) : null;
    const token = localStorage.getItem('token');

    // --- REGRAS DE PERMISSÃO COMPLEMENTARES ---
    
    // Regra 1: Apenas o dono do comentário pode EDITAR
    const possoEditar = me?.id === comentario.id_utilizador;

    // Regra 2: O dono do comentário OR o dono do tweet pai OR o admin podem ELIMINAR
    const possoEliminar = 
        me?.id === comentario.id_utilizador || 
        me?.id === idDonoDoTweet || 
        me?.is_admin === true || 
        me?.admin === true;

    const handleUpdate = async () => {
        if (!editText.trim()) return;
        try {
            const response = await fetch(`${API_URL}/comments/${comentario.id_comentario}`, {
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
        } catch (error) { console.error(error); }
    };

    const handleDelete = async () => {
        if (!window.confirm('Deseja eliminar este comentário?')) return;
        try {
            const response = await fetch(`${API_URL}/comments/${comentario.id_comentario}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) onRefresh();
        } catch (error) { console.error(error); }
    };

    return (
        <div style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555' }}>
                <strong>@{comentario.utilizador?.username}</strong>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    {/* Botão de Editar: Visível apenas para o autor do comentário */}
                    {possoEditar && (
                        <button onClick={() => setIsEditing(!isEditing)} style={{ background: 'none', border: 'none', color: 'orange', cursor: 'pointer' }}>
                            {isEditing ? 'Cancelar' : 'Editar'}
                        </button>
                    )}
                    {/* Botão de Eliminar: Visível para o autor, dono do tweet ou admin */}
                    {possoEliminar && !isEditing && (
                        <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
                            Eliminar
                        </button>
                    )}
                </div>
            </div>

            {isEditing ? (
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                    <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} style={{ flex: 1, padding: '5px' }} />
                    <button onClick={handleUpdate} style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Salvar</button>
                </div>
            ) : (
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>{comentario.texto}</p>
            )}
        </div>
    );
};

export default CommentItem;


