import React, { useState } from 'react';

interface CreateTweetProps {
    onTweetCreated: () => void; // Função que atualiza o feed quando crias um tweet
}

const CreateTweet: React.FC<CreateTweetProps> = ({ onTweetCreated }) => {
    const [texto, setTexto] = useState('');
    const [imagem, setImagem] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!texto) return;

        // Como enviamos uma imagem, TEMOS de usar FormData em vez de JSON
        const formData = new FormData();
        formData.append('texto', texto);
        if (imagem) {
            formData.append('imagem', imagem); // O nome 'imagem' bate certo com o upload.single('imagem') do Multer
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/tweets', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                setTexto('');
                setImagem(null);
                onTweetCreated(); // Atualiza a lista do feed
            } else {
                alert('Erro ao publicar o tweet.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ borderBottom: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
            <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="O que está a acontecer?"
                maxLength={280}
                style={{ width: '100%', height: '80px', padding: '10px', resize: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImagem(e.target.files ? e.target.files[0] : null)} 
                />
                <button type="submit" style={{ padding: '8px 20px', backgroundColor: '#1d9bf0', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Tweetar
                </button>
            </div>
        </form>
    );
};

export default CreateTweet;
