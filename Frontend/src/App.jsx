import React, { useState } from 'react';
import SetupDebate from './components/SetupDebate';
import DebateStage from './components/DebateStage';
import './index.css';

function App() {
  const [debateContext, setDebateContext] = useState(null);

  const handleDebateStarted = (data) => {
    setDebateContext(data);
  };

  const handleReset = () => {
    setDebateContext(null);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>AI Debate Stage</h1>
        <p>Watch powerful LLMs debate any topic</p>
      </header>

      <main>
        {!debateContext ? (
          <SetupDebate onDebateStarted={handleDebateStarted} />
        ) : (
          <DebateStage debateContext={debateContext} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}

export default App;
