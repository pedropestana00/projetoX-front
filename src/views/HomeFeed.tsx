import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CreateTweet from '../components/CreateTweet';
import TweetCard from '../components/TweetCard';

const HomeFeed: React.FC = () => {
    const [tweets, setTweets] = useState<any[]>([]);
    const token = localStorage.getItem('token');

    const carregarFeed = async () => {
        try {
            const response = await fetch('http://localhost:3000/tweets/seguindo', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setTweets(data);
            }
        } catch (error) {
            console.error('Erro ao carregar o feed:', error);
        }
    };

    useEffect(() => {
        carregarFeed();
    }, []);

    return (
        <div style={{ display: 'flex', fontFamily: 'Arial' }}>
            <Navbar />
            <div style={{ marginLeft: '270px', padding: '20px', width: '600px' }}>
                <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Página Inicial</h2>
                <CreateTweet onTweetCreated={carregarFeed} />
                
                {tweets.length === 0 ? (
                    <p style={{ color: '#555', textAlign: 'center', marginTop: '20px' }}>Ainda não segue ninguém ou ninguém publicou nada. Vá à página Explorar!</p>
                ) : (
                    tweets.map(t => (
                        <TweetCard key={t.id_tweet} tweet={t} onRefresh={carregarFeed} />
                    ))
                )}
            </div>
        </div>
    );
};

export default HomeFeed;
