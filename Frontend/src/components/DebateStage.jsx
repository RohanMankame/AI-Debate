import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function DebateStage({ debateContext, onReset }) {
    const [debate, setDebate] = useState(debateContext.debate);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const endOfHistoryRef = useRef(null);

    useEffect(() => {
        if (endOfHistoryRef.current) {
            endOfHistoryRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [debate.history]);

    const handleNextRound = async () => {
        setLoading(true);
        setError('');
        try {
            const resp = await axios.post(`${API_URL}/next_round`, { debate_id: debateContext.debate_id });
            setDebate(resp.data.debate);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch the next round. Check backend and API keys.');
        } finally {
            setLoading(false);
        }
    };

    const isCompleted = debate.status === 'completed';

    return (
        
        <div className="debate-stage">
            
            <div className="debate-controls">
                <div className="debate-status">
                    <span className="round-info">
                        {isCompleted ? 'Debate Concluded' : `Round ${debate.current_round} of ${debate.total_rounds}`}
                    </span>
                </div>

                

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={onReset} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                        New Debate
                    </button>
                    {!isCompleted && (
                        <button onClick={handleNextRound} className="btn btn-primary" disabled={loading}>
                            {loading ? <span className="loading-spinner"></span> : null}
                            {loading ? 'Generating Response...' : 'Next Turn'}
                        </button>
                    )}
                </div>
            </div>

            <h4>Topic: {debate.topic}</h4>

            {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

            <div className="history-container">
                {debate.history.length === 0 && !loading && !isCompleted && (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem 0', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                        The debate is ready! Click "Next Round" to begin the opening statements.
                    </div>
                )}

                {debate.history.map((h, idx) => (
                    <div key={idx} className="round-block">
                        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', color: '#94a3b8' }}>Round {h.round}</h3>

                        {h.team1_argument && (
                            <div className="argument-card team1">
                                <div className="team-header">
                                    <span className="team-name">{debate.team1.name}</span>
                                    <span className="model-badge">{debate.team1.model}</span>
                                </div>
                                <div className="argument-text">{h.team1_argument}</div>
                            </div>
                        )}

                        {h.team2_argument && (
                            <div className="argument-card team2" style={{ animationDelay: '0.2s' }}>
                                <div className="team-header">
                                    <span className="team-name">{debate.team2.name}</span>
                                    <span className="model-badge">{debate.team2.model}</span>
                                </div>
                                <div className="argument-text">{h.team2_argument}</div>
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="round-block" style={{ border: 'none' }}>
                        <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--accent-color)' }}>
                            <span className="loading-spinner"></span>
                            <span>LLM is constructing arguments...</span>
                        </div>
                    </div>
                )}

                {isCompleted && debate.verdict && (
                    <div className="verdict-card" style={{ 
                        marginTop: '2rem', 
                        padding: '2rem', 
                        background: 'rgba(16, 185, 129, 0.1)', 
                        border: '2px solid var(--accent-color)', 
                        borderRadius: '12px',
                        animation: 'fadeIn 0.5s ease-out'
                    }}>
                        <h2 style={{ color: 'var(--accent-color)', marginBottom: '1rem', textAlign: 'center' }}>Judge's Verdict</h2>
                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                            {debate.verdict}
                        </div>
                    </div>
                )}

                <div ref={endOfHistoryRef} />
            </div>
        </div>
    );
}
