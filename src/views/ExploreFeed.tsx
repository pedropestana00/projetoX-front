import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TweetCard from '../components/TweetCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ExploreFeed: React.FC = () => {
    const [tweets, setTweets] = useState<any[]>([]);
    const token = localStorage.getItem('token');

    const carregarFeedGlobal = async () => {
        try {
            const response = await fetch(`${API_URL}/tweets/global`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setTweets(data);
            }
        } catch (error) {
            console.error('Erro ao carregar o feed global:', error);
        }
    };

    useEffect(() => {
        carregarFeedGlobal();
    }, []);

    return (
        <div style={{ display: 'flex', fontFamily: 'Arial' }}>
            <Navbar />
            <div style={{ marginLeft: '270px', padding: '20px', width: '600px' }}>
                <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>🌐 Explorar a Rede Social</h2>
                
                {tweets.map(t => (
                    <TweetCard key={t.id} tweet={t} onRefresh={carregarFeedGlobal} />
                ))}
            </div>
        </div>
    );
};

export default ExploreFeed;
