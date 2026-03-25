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
