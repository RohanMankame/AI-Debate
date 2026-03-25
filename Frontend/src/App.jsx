import React, { useState } from 'react';
import SetupDebate from './components/SetupDebate';
import DebateStage from './components/DebateStage';

function App() {
  const [debateContext, setDebateContext] = useState(null);

  const handleDebateStarted = (data) => {
    setDebateContext(data);
  };

  const handleReset = () => {
    setDebateContext(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      <header className="py-6 px-6 flex flex-col items-center text-center space-y-2">
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">AI Debate Stage</h1>
            <p className="text-slate-400 max-w-xl text-sm font-medium">Configure and witness high-stakes intellectual battles between state-of-the-art language models.</p>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 pb-12">
        {!debateContext ? (
          <div className="max-w-3xl mx-auto">
            <SetupDebate onDebateStarted={handleDebateStarted} />
          </div>
        ) : (
          <div className="h-[700px]">
            <DebateStage debateContext={debateContext} onReset={handleReset} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
