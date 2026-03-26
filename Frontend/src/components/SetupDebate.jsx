import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const MODELS = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4.1-nano', 'gpt-4o-mini', 'gpt-4.1', 'gpt-5-chat-latest'];
const PERSONALITIES = [
    { id: 'professional', label: 'Professional & Logical', prompt: 'Be precise, use data-driven arguments, and maintain a formal tone.' },
    { id: 'aggressive', label: 'Aggressive & Assertive', prompt: 'Be bold, challenge every point your opponent makes, and use strong, forceful language.' },
    { id: 'sarcastic', label: 'Sarcastic & Witty', prompt: 'Use humor, irony, and sharp wit to dismantle your opponent\'s logic.' },
    { id: 'persuasive', label: 'Emotional & Persuasive', prompt: 'Focus on storytelling, human impact, and appealing to the audience\'s emotions.' },
    { id: 'academic', label: 'Academic & Intellectual', prompt: 'Use complex vocabulary, cite hypothetical studies, and frame arguments within philosophical frameworks.' }
];

export default function SetupDebate({ onDebateStarted }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        topic: 'Should AI be allowed to make decisions in critical areas like healthcare, criminal justice and financial markets?',
        rounds: 3,
        points: 1,
        team1Name: 'AI Advocates',
        team1Viewpoint: 'AI should be allowed to make decisions in critical areas.',
        team1Model: 'gpt-3.5-turbo',
        team1Personality: 'professional',
        team2Name: 'AI Skeptics',
        team2Viewpoint: 'AI should not be allowed to make decisions in critical areas.',
        team2Model: 'gpt-3.5-turbo',
        team2Personality: 'professional',
        judgeModel: 'gpt-4'
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
                model: formData.team1Model,
                personality: PERSONALITIES.find(p => p.id === formData.team1Personality)?.prompt || ''
            },
            team2: {
                name: formData.team2Name,
                viewpoint: formData.team2Viewpoint,
                model: formData.team2Model,
                personality: PERSONALITIES.find(p => p.id === formData.team2Personality)?.prompt || ''
            },
            judge_model: formData.judgeModel
        };

        try {
            const resp = await axios.post(`${API_URL}/start_debate`, payload);
            onDebateStarted(resp.data);
        } catch (err) {
            console.error(err);
            setError('Failed to start debate. Check backend connection. Access this link to wake up the backend: https://ai-debate-backend-plqd.onrender.com');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-white text-center">Debate Configuration</h2>
            {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-center text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Debate Topic</label>
                    <input 
                        type="text" 
                        name="topic" 
                        value={formData.topic} 
                        onChange={handleChange} 
                        className="bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Number of Rounds</label>
                        <input 
                            type="number" 
                            name="rounds" 
                            value={formData.rounds} 
                            onChange={handleChange} 
                            min="1" 
                            max="10" 
                            className="bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required 
                        />
                    </div>
                    <div className="flex flex-col space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Points per Round</label>
                        <input 
                            type="number" 
                            name="points" 
                            value={formData.points} 
                            onChange={handleChange} 
                            min="1" 
                            max="5" 
                            className="bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Team 1 */}
                    <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20 space-y-3">
                        <h3 className="text-lg font-bold text-blue-400 border-b border-blue-500/20 pb-1">Team 1</h3>
                        <div className="flex flex-col space-y-1">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Team Name</label>
                            <input 
                                type="text" 
                                name="team1Name" 
                                value={formData.team1Name} 
                                onChange={handleChange} 
                                className="bg-black/30 border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Model</label>
                                <select 
                                    name="team1Model" 
                                    value={formData.team1Model} 
                                    onChange={handleChange}
                                    className="bg-black/30 border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    {MODELS.map(m => <option key={m} value={m} className="bg-slate-800">{m}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Personality</label>
                                <select 
                                    name="team1Personality" 
                                    value={formData.team1Personality} 
                                    onChange={handleChange}
                                    className="bg-black/30 border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    {PERSONALITIES.map(p => <option key={p.id} value={p.id} className="bg-slate-800">{p.label}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Viewpoint</label>
                            <textarea 
                                name="team1Viewpoint" 
                                value={formData.team1Viewpoint} 
                                onChange={handleChange} 
                                rows="2" 
                                className="bg-black/30 border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                required 
                            />
                        </div>
                    </div>

                    {/* Team 2 */}
                    <div className="bg-pink-500/10 p-4 rounded-lg border border-pink-500/20 space-y-3">
                        <h3 className="text-lg font-bold text-pink-400 border-b border-pink-500/20 pb-1">Team 2</h3>
                        <div className="flex flex-col space-y-1">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Team Name</label>
                            <input 
                                type="text" 
                                name="team2Name" 
                                value={formData.team2Name} 
                                onChange={handleChange} 
                                className="bg-black/30 border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                                required 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Model</label>
                                <select 
                                    name="team2Model" 
                                    value={formData.team2Model} 
                                    onChange={handleChange}
                                    className="bg-black/30 border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                                >
                                    {MODELS.map(m => <option key={m} value={m} className="bg-slate-800">{m}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Personality</label>
                                <select 
                                    name="team2Personality" 
                                    value={formData.team2Personality} 
                                    onChange={handleChange}
                                    className="bg-black/30 border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                                >
                                    {PERSONALITIES.map(p => <option key={p.id} value={p.id} className="bg-slate-800">{p.label}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Viewpoint</label>
                            <textarea 
                                name="team2Viewpoint" 
                                value={formData.team2Viewpoint} 
                                onChange={handleChange} 
                                rows="2" 
                                className="bg-black/30 border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
                                required 
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/20 space-y-1">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-indigo-300">Judge Model</label>
                        <p className="text-[10px] text-slate-400 italic">Evaluates the final winner.</p>
                    </div>
                    <select 
                        name="judgeModel" 
                        value={formData.judgeModel} 
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {MODELS.map(m => <option key={m} value={m} className="bg-slate-800">{m}</option>)}
                    </select>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    disabled={loading}
                >
                    {loading && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {loading ? 'Initializing...' : 'Launch Debate'}
                </button>
            </form>
        </div>
    );
}
