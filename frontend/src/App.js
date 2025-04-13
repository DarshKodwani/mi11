import React, { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';

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

// Ensure the toggleMute function and isMuted state are accessible globally
function App() {
  const [workflowStep, setWorkflowStep] = useState(0);
  const [documentText, setDocumentText] = useState('');
  const [hypotheses, setHypotheses] = useState([]);
  const [selectedHypothesis, setSelectedHypothesis] = useState(null);
  const [dataRequirements, setDataRequirements] = useState('');
  const [analysisPlan, setAnalysisPlan] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [showCoverPage, setShowCoverPage] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = React.useRef(null);
  const [inputMode, setInputMode] = useState(null);
  const [typedInfo, setTypedInfo] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [summary, setSummary] = useState([]); // Initialize as an array to store conversation messages
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId] = useState(uuidv4()); // Generate a unique session ID for the user
  const [finalSummary, setFinalSummary] = useState(''); // Added state for final summary

  useEffect(() => {
    // Create the audio element directly in the DOM
    const audioElement = new Audio('/James%20Bond%20(Original).mp3');
    audioElement.loop = true;
    audioRef.current = audioElement; // Store in ref for persistence

    const handleFirstInteraction = () => {
      audioElement.play().catch((error) => {
        console.error('Audio play failed:', error);
      });
      document.removeEventListener('click', handleFirstInteraction);
    };

    // Add event listener for user interaction
    document.addEventListener('click', handleFirstInteraction, { once: true });

    // Cleanup
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      audioElement.pause();
      audioElement.src = '';
    };
  }, []); // Only run once on component mount

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      // Unmute - start playing
      audio.play().catch((error) => {
        console.error('Play failed:', error);
      });
    } else {
      // Mute - pause audio
      audio.pause();
    }

    setIsMuted(!isMuted);
    console.log('Mute toggled, new state:', !isMuted); // Debug logging
  };

  const jokes = [
    "Why did the data scientist break up with the graph? It just didn’t have enough points!",
    "Why was the math book sad? It had too many problems!",
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "Why did the statistician bring a ladder? To reach new heights in data analysis!",
    "Why was the computer cold? It left its Windows open!"
  ];

  const handleAnalyzeDocument = async () => {
    const mockHypotheses = [
      'Hypothesis 1: Sales increase with marketing spend.',
      'Hypothesis 2: Customer churn decreases with better support.',
      'Hypothesis 3: Product demand is seasonal.'
    ];
    setHypotheses(mockHypotheses);
    setWorkflowStep(1);
  };

  const handleDefineDataRequirements = async () => {
    const mockDataRequirements = 'Data needed: Sales data, marketing spend data, customer support logs, and seasonal trends.';
    setDataRequirements(mockDataRequirements);
    setWorkflowStep(2);
  };

  const handleGenerateAnalysisPlan = async () => {
    const mockAnalysisPlan = 'Plan: Use regression models to analyze sales vs. marketing spend. Perform feature engineering for seasonal trends.';
    setAnalysisPlan(mockAnalysisPlan);
    setWorkflowStep(3);
  };

  const handleGenerateCode = async () => {
    const mockGeneratedCode = `import pandas as pd\nfrom sklearn.linear_model import LinearRegression\n\n# Load data\ndata = pd.read_csv('data.csv')\n\n# Feature engineering\ndata['seasonal_trend'] = ...\n\n# Train model\nmodel = LinearRegression()\nmodel.fit(data[['marketing_spend', 'seasonal_trend']], data['sales'])`;
    setGeneratedCode(mockGeneratedCode);
    setWorkflowStep(4);
  };

  const handleContinue = () => {
    setShowCoverPage(false);
  };

  const handleHypothesisClick = (index) => {
    setSelectedHypothesis(index);
  };

  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

  const agents = [
    { name: 'Moneypenny', image: '/moneypenny.png', thought: 'Let’s start by analyzing the document. Every great mission starts with understanding the problem!' },
    { name: 'Q', image: '/Q_.png', thought: 'Ah, the tools and data! The right data is like the right gadget—it makes all the difference!' },
    { name: 'Bond', image: '/007.png', thought: 'Time to roll up our sleeves and get to work. Let’s make it happen!' },
    { name: 'Bond', image: '/007.png', thought: 'Mission accomplished! Let’s review the results and celebrate success!' }
  ];

  const handleFileUpload = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const handleProcessTypedInfo = async () => {
    console.log('Processing typed information:', typedInfo); // Log the input being processed
    setIsProcessing(true);
    try {
      const response = await clarifyProblem(typedInfo, sessionId); // Pass sessionId to the backend
      console.log('Received response from clarifyProblem:', response); // Log the response

      setSummary((prevSummary) => [
        ...prevSummary,
        { role: 'user', content: typedInfo },
        { role: 'assistant', content: response },
      ]);

      setTypedInfo(''); // Clear the input box for the next user input
    } catch (error) {
      console.error('Error processing typed information:', error);
      setSummary((prevSummary) => [
        ...prevSummary,
        { role: 'error', content: 'An error occurred while processing the input.' },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessUploadedFile = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    try {
      const fileContent = await uploadedFile.text();
      const response = await clarifyProblem(fileContent);
      setSummary(response);
    } catch (error) {
      console.error('Error processing uploaded file:', error);
      setSummary('An error occurred while processing the file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalizeSummary = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/finalize_summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetails}`);
      }

      const data = await response.json();
      setFinalSummary(data.final_summary); // Store the final summary
      setWorkflowStep(4); // Ensure workflowStep is updated to 4
    } catch (error) {
      console.error('Error finalizing summary:', error.message);
    }
  };

  const handleLooksGood = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/finalize_summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetails}`);
      }

      const data = await response.json();
      const finalSummary = data.final_summary; // Get the final summary

      // Automatically download the summary
      const blob = new Blob([finalSummary], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'moneypenny_summary.txt');

      console.log('Summary downloaded successfully.');
    } catch (error) {
      console.error('Error finalizing summary:', error.message);
    }
  };

  return (
    <div className="App">
      <video autoPlay loop muted>
        <source src="/electronic-circuit-board.1920x1080.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button 
        className="mute-button" 
        onClick={toggleMute} 
        style={{ zIndex: 9999 }} // Ensure button is above other elements
      >
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
      {!showCoverPage && (
        <div className="workflow-pane">
          {agents.map((agent, index) => (
            <div
              key={index}
              className={`workflow-section ${workflowStep === index + 1 ? 'active' : ''}`}
              onClick={() => setWorkflowStep(index + 1)}
            >
              {index === 0 ? 'Tell Me the Problem' : index === 1 ? 'Define Data Requirements' : index === 2 ? 'Generate Analysis Plan' : 'Generate Code'}
            </div>
          ))}
        </div>
      )}
      {showCoverPage ? (
        <div className="cover-page">
          <div className="agent-image-container">
            <img src="/M_.png" alt="M" className="agent-image" />
            <div className="thought-bubble-m">Welcome, Agent. Your mission is to uncover insights from the data. Proceed with caution.</div>
          </div>
          <h1>Welcome to Mi 11</h1>
          <p>{randomJoke}</p>
          <button className="primary-button" onClick={() => { setShowCoverPage(false); setWorkflowStep(1); }}>Let’s Crunch Some Numbers!</button>
        </div>
      ) : (
        <div className="workflow-page">
          {workflowStep === 1 && (
            <div className="agent-image-container-moneypenny" style={{ position: 'relative', height: '100vh' }}>
              <img src="/moneypenny.png" alt="Moneypenny" className="agent-image" style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
              <div className="thought-bubble-moneypenny" style={{ position: 'absolute', top: '20%', left: 'calc(50% + 3cm)' }}>Let’s start by analyzing the document. Every great mission starts with understanding the problem!</div>
              <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <button className="primary-button" onClick={() => setInputMode('type')}>Type Information</button>
                <button className="primary-button" onClick={() => setInputMode('upload')} style={{ marginLeft: '20px' }}>Upload Document</button>
                {inputMode === 'type' && (
                  <div style={{ marginTop: '20px' }}>
                    <textarea
                      placeholder="Enter your information here..."
                      style={{ width: '500px', height: '150px', display: 'block', margin: '10px auto', fontSize: '16px', padding: '10px' }}
                      value={typedInfo}
                      onChange={(e) => setTypedInfo(e.target.value)}
                    />
                    <button className="primary-button" onClick={handleProcessTypedInfo}>Process</button>
                  </div>
                )}
                {inputMode === 'upload' && (
                  <div style={{ marginTop: '20px' }}>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e)}
                      style={{ display: 'block', margin: '10px auto' }}
                    />
                    {uploadedFile && <p>Uploaded: {uploadedFile.name}</p>}
                    <button className="primary-button" onClick={handleProcessUploadedFile}>Process</button>
                  </div>
                )}
                {isProcessing && (
                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <span role="img" aria-label="thinking" style={{ fontSize: '2rem' }}>🤔</span>
                    <p>Processing...</p>
                  </div>
                )}
                {summary && (
                  <div className="conversation-container" style={{ marginTop: '20px', padding: '10px', width: '500px', margin: '20px auto', fontSize: '16px', lineHeight: '1.5' }}>
                    {summary.map((message, index) => (
                      <div
                        key={index}
                        className={`conversation-bubble ${message.role}`}
                        style={{
                          display: 'flex',
                          justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                          marginBottom: '10px',
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '70%',
                            padding: '10px',
                            borderRadius: '15px',
                            backgroundColor: message.role === 'user' ? '#0078d4' : '#f3f2f1',
                            color: message.role === 'user' ? 'white' : 'black',
                            textAlign: 'left',
                          }}
                        >
                          <strong>{message.role === 'user' ? 'You' : 'Moneypenny'}:</strong>
                          <p style={{ margin: '5px 0 0' }}>{message.content}</p>
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: '20px' }}>
                      <textarea
                        placeholder="Add your thoughts here..."
                        style={{ width: '100%', height: '100px', fontSize: '14px', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        value={typedInfo}
                        onChange={(e) => setTypedInfo(e.target.value)}
                      />
                      <button className="primary-button" onClick={handleProcessTypedInfo} style={{ marginRight: '10px' }}>Submit Thoughts</button>
                      <button className="primary-button" onClick={handleLooksGood} style={{ marginRight: '10px' }}>It Looks Good</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {workflowStep === 2 && (
            <div className="agent-image-container-q" style={{ position: 'relative', height: '100vh' }}>
              <img src="/Q_.png" alt="Q" className="agent-image" style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
              <div className="thought-bubble-q" style={{ position: 'absolute', top: '20%', left: 'calc(50% + 2cm)' }}>Ah, the tools and data! The right data is like the right gadget—it makes all the difference!</div>
            </div>
          )}
          {workflowStep === 3 && (
            <div className="agent-image-container-bond" style={{ position: 'relative', height: '100vh' }}>
              <img src="/007.png" alt="Bond" className="agent-image" style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
              <div className="thought-bubble-bond" style={{ position: 'absolute', top: '20%', left: 'calc(50% + 2cm)' }}>Time to roll up our sleeves and get to work. Let’s make it happen!</div>
            </div>
          )}
          {workflowStep === 4 && (
            <div className="agent-image-container-bond" style={{ position: 'relative', height: '100vh' }}>
              <img src="/007.png" alt="Bond" className="agent-image" style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
              <div className="thought-bubble-bond" style={{ position: 'absolute', top: '20%', left: 'calc(50% + 2cm)' }}>Mission accomplished! Let’s review the results and celebrate success!</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
