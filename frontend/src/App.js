import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
import MoneypennyProblemStatement from './components/moneypenny_problem_statement';
import QData from './components/Q_data';
import BondAnalysis from './components/bond_analysis';
import BondCode from './components/bond_code';
import MCoverPage from './components/M_coverpage';

const clarifyProblem = async (inputText, sessionId) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/clarify_problem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: inputText, session_id: sessionId }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetails}`);
    }

    const data = await response.json();
    return data.response; // Return the assistant's response
  } catch (error) {
    console.error('Error in clarifyProblem:', error.message);
    throw error;
  }
};

const handleDownloadSummary = (finalSummary) => {
  const blob = new Blob([finalSummary], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'moneypenny_summary.txt');
};

function App() {
  const [workflowStep, setWorkflowStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // Added state for mute functionality
  const audioRef = useRef(null);

  useEffect(() => {
    const audioElement = new Audio('/audio/James%20Bond%20(Original).mp3');
    audioElement.loop = true;
    audioRef.current = audioElement;

    const handleFirstInteraction = () => {
      audioElement.play().catch((error) => {
        console.error('Audio play failed:', error);
      });
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      audioElement.pause();
      audioElement.src = '';
    };
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.muted = false;
      audio.play().catch((error) => {
        console.error('Play failed:', error);
      });
    } else {
      audio.muted = true;
    }

    setIsMuted(!isMuted);
  };

  const renderPage = () => {
    switch (workflowStep) {
      case 0:
        return <MCoverPage setWorkflowStep={setWorkflowStep} />;
      case 1:
        return <MoneypennyProblemStatement setWorkflowStep={setWorkflowStep} />;
      case 2:
        return <QData setWorkflowStep={setWorkflowStep} />;
      case 3:
        return <BondAnalysis setWorkflowStep={setWorkflowStep} />;
      case 4:
        return <BondCode setWorkflowStep={setWorkflowStep} />;
      default:
        return <MCoverPage setWorkflowStep={setWorkflowStep} />;
    }
  };

  return (
    <div className="App">
      <video autoPlay loop muted>
        <source src="/videos/electronic-circuit-board.1920x1080.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {workflowStep !== 0 && (
        <div className="workflow-pane">
          <div className={`workflow-section ${workflowStep === 1 ? 'active' : ''}`} onClick={() => setWorkflowStep(1)}>
            Tell Me the Problem
          </div>
          <div className={`workflow-section ${workflowStep === 2 ? 'active' : ''}`} onClick={() => setWorkflowStep(2)}>
            Define Data Requirements
          </div>
          <div className={`workflow-section ${workflowStep === 3 ? 'active' : ''}`} onClick={() => setWorkflowStep(3)}>
            Generate Analysis Plan
          </div>
          <div className={`workflow-section ${workflowStep === 4 ? 'active' : ''}`} onClick={() => setWorkflowStep(4)}>
            Generate Code
          </div>
        </div>
      )}
      <button className="mute-button" onClick={toggleMute}>
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
      {renderPage()}
    </div>
  );
}

export default App;
