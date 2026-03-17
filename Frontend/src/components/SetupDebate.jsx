import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';
const MODELS = ['gpt-3.5-turbo', 'gpt-4','gpt-4.1-nano', 'gpt-4o-mini' ,'gpt-4.1','gpt-5-chat-latest' ];

export default function SetupDebate({ onDebateStarted }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        topic: 'Should AI be allowed to make decisions in critical areas like healthcare, criminal justice and financial markets?',
        rounds: 3,
        points: 1,
        team1Name: 'AI Advocates',
        team1Viewpoint: 'AI should be allowed to make decisions in critical areas as it can analyze vast amounts of data, reduce human bias, and improve efficiency. With proper oversight, AI can enhance outcomes in healthcare, criminal justice, and financial markets.',
        team1Model: 'gpt-3.5-turbo',
        team2Name: 'AI Skeptics',
        team2Viewpoint: 'AI should not be allowed to make decisions in critical areas due to ethical concerns, potential biases in training data, and lack of accountability. Human judgment is essential in these domains to ensure fairness, empathy, and moral responsibility.',
        team2Model: 'gpt-3.5-turbo'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = {
            topic: formData.topic,
            rounds: parseInt(formData.rounds),
            points: parseInt(formData.points),
            team1: {
                name: formData.team1Name,
                viewpoint: formData.team1Viewpoint,
                model: formData.team1Model
            },
            team2: {
                name: formData.team2Name,
                viewpoint: formData.team2Viewpoint,
                model: formData.team2Model
            }
        };

        try {
            const resp = await axios.post(`${API_URL}/start_debate`, payload);
            onDebateStarted(resp.data);
        } catch (err) {
            console.error(err);
            setError('Failed to start debate. Check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card">
            <h2 style={{ marginBottom: '1.5rem' }}>Configure Debate</h2>
            {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}
            <form onSubmit={handleSubmit} className="setup-form">
                <div className="form-group">
                    <label>Debate Topic</label>
                    <input type="text" name="topic" value={formData.topic} onChange={handleChange} required />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Number of Rounds</label>
                        <input type="number" name="rounds" value={formData.rounds} onChange={handleChange} min="1" max="10" required />
                    </div>
                    <div className="form-group">
                        <label>Points to Address per Round</label>
                        <input type="number" name="points" value={formData.points} onChange={handleChange} min="1" max="5" required />
                    </div>
                </div>

                <div className="form-row">
                    {/* Team 1 */}
                    <div className="form-group" style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                        <h3 style={{ color: 'var(--team1-color)', marginBottom: '1rem' }}>Team 1</h3>
                        <div className="form-group">
                            <label>Team Name</label>
                            <input type="text" name="team1Name" value={formData.team1Name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Model</label>
                            <select name="team1Model" value={formData.team1Model} onChange={handleChange}>
                                {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Viewpoint/Instructions</label>
                            <textarea name="team1Viewpoint" value={formData.team1Viewpoint} onChange={handleChange} rows="3" required />
                        </div>
                    </div>

                    {/* Team 2 */}
                    <div className="form-group" style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                        <h3 style={{ color: 'var(--team2-color)', marginBottom: '1rem' }}>Team 2</h3>
                        <div className="form-group">
                            <label>Team Name</label>
                            <input type="text" name="team2Name" value={formData.team2Name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Model</label>
                            <select name="team2Model" value={formData.team2Model} onChange={handleChange}>
                                {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Viewpoint/Instructions</label>
                            <textarea name="team2Viewpoint" value={formData.team2Viewpoint} onChange={handleChange} rows="3" required />
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                    {loading ? <span className="loading-spinner"></span> : null}
                    {loading ? 'Starting Debate...' : 'Start Debate'}
                </button>
            </form>
        </div>
    );
}
