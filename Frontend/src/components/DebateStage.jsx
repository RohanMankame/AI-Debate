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
        <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Header / Controls */}
            <div className="p-4 border-b border-white/10 bg-black/20 flex flex-col md:flex-row justify-between items-center gap-3">
                <div className="flex flex-col items-center md:items-start tracking-tighter">
                    <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent capitalize">
                        {debate.topic}
                    </h2>
                    <span className="text-[10px] font-bold uppercase py-0.5 px-2 bg-white/5 rounded-full text-blue-300 mt-1">
                        {isCompleted ? 'Debate Concluded' : `Round ${debate.current_round} of ${debate.total_rounds}`}
                    </span>
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={onReset} 
                        className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white font-semibold transition-all border border-white/10 whitespace-nowrap"
                    >
                        New Debate
                    </button>
                    {!isCompleted && (
                        <button 
                            onClick={handleNextRound} 
                            disabled={loading}
                            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs text-white font-bold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 min-w-[120px] justify-center"
                        >
                            {loading && (
                                <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {loading ? 'LLM is Thinking...' : 'Next Turn'}
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-500/20 border-b border-red-500 text-red-100 p-2 text-center text-[10px]">
                    {error}
                </div>
            )}

            {/* History Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth custom-scrollbar">
                {debate.history.length === 0 && !loading && !isCompleted && (
                    <div className="flex flex-col items-center justify-center py-12 opacity-50 space-y-3">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-xl">
                        </div>
                        <p className="text-slate-400 text-center max-w-xs text-xs">
                            The floor is open. Click "Next Turn" to start.
                        </p>
                    </div>
                )}

                {debate.history.map((h, idx) => (
                    <div key={idx} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center gap-3">
                            <span className="h-px flex-1 bg-white/5"></span>
                            <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Round {h.round}</span>
                            <span className="h-px flex-1 bg-white/5"></span>
                        </div>

                        {h.team1_argument && (
                            <div className="flex flex-col space-y-1.5 max-w-[90%] mr-auto group">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center font-bold text-[10px] text-white shadow-lg shadow-blue-500/20">1</div>
                                    <span className="font-bold text-blue-400 text-xs tracking-tight">{debate.team1.name}</span>
                                    <span className="text-[9px] bg-blue-500/10 text-blue-300 font-mono px-1.5 py-0.5 rounded border border-blue-500/20">{debate.team1.model}</span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl rounded-tl-none border border-white/5 text-slate-200 text-sm leading-relaxed shadow-sm group-hover:bg-white/[0.07] transition-colors whitespace-pre-wrap">
                                    {h.team1_argument}
                                </div>
                            </div>
                        )}

                        {h.team2_argument && (
                            <div className="flex flex-col space-y-1.5 max-w-[90%] ml-auto items-end group">
                                <div className="flex items-center gap-2 flex-row-reverse">
                                    <div className="w-6 h-6 rounded-md bg-pink-600 flex items-center justify-center font-bold text-[10px] text-white shadow-lg shadow-pink-500/20">2</div>
                                    <span className="font-bold text-pink-400 text-xs tracking-tight">{debate.team2.name}</span>
                                    <span className="text-[9px] bg-pink-500/10 text-pink-300 font-mono px-1.5 py-0.5 rounded border border-pink-500/20">{debate.team2.model}</span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl rounded-tr-none border border-white/5 text-slate-200 text-sm leading-relaxed shadow-sm text-right group-hover:bg-white/[0.07] transition-colors whitespace-pre-wrap">
                                    {h.team2_argument}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex items-center justify-center py-4">
                        <div className="flex space-x-1.5">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                        </div>
                    </div>
                )}

                {isCompleted && debate.verdict && (
                    <div className="mt-8 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl p-6 animate-in zoom-in duration-700">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-px w-8 bg-emerald-500/20"></div>
                            <h3 className="text-lg font-black text-emerald-400 uppercase tracking-widest text-center">Verdict</h3>
                            <div className="h-px w-8 bg-emerald-500/20"></div>
                        </div>
                        <div className="text-slate-200 leading-relaxed text-base font-medium whitespace-pre-wrap text-center italic">
                            {debate.verdict}
                        </div>
                    </div>
                )}

                <div ref={endOfHistoryRef} className="h-2" />
            </div>
        </div>
    );
}
