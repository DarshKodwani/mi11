import React, { useState } from 'react';
import './moneypenny_problem_statement.css';
import { saveAs } from 'file-saver';

function MoneypennyProblemStatement({ setWorkflowStep }) {
  const [inputMode, setInputMode] = useState(null);
  const [typedInfo, setTypedInfo] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [summary, setSummary] = useState([]); // Store conversation messages
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessTypedInfo = async () => {
    console.log('Processing typed information:', typedInfo);
    setIsProcessing(true); // Ensure processing starts
    try {
      const response = await fetch('/api/clarify_problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: typedInfo, session_id: 'moneypenny-session' }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetails}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debugging log to check API response

      if (data && data.response) {
        console.log('Downloading response:', data.response);
        const blob = new Blob([data.response], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'moneypenny_response.txt');
      } else {
        console.error('Invalid API response format:', data);
      }

      setTypedInfo('');
    } catch (error) {
      console.error('Error processing typed information:', error);
    } finally {
      setTimeout(() => {
        setIsProcessing(false); // Ensure processing ends after a slight delay
      }, 1000); // Add a delay to ensure the user sees the processing message
    }
  };

  const handleFileUpload = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  return (
    <div className="agent-image-container-moneypenny" style={{ position: 'relative', height: '100vh' }}>
      <img src="/images/moneypenny.png" alt="Moneypenny" className="agent-image" style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
      <div className="thought-bubble-moneypenny" style={{ position: 'absolute', top: '20%', left: 'calc(50% + 3cm)' }}>
        Let’s start by analyzing the document. Every great mission starts with understanding the problem!
      </div>
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
              onChange={handleFileUpload}
              style={{ display: 'block', margin: '10px auto' }}
            />
            {uploadedFile && <p>Uploaded: {uploadedFile.name}</p>}
            <button className="primary-button" onClick={() => setWorkflowStep(2)}>Process</button>
          </div>
        )}
        {isProcessing && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span role="img" aria-label="thinking" style={{ fontSize: '2rem' }}>🤔</span>
            <p>Processing...</p>
          </div>
        )}
        {summary.length > 0 ? (
          <div className="conversation-container" style={{ marginTop: '20px', padding: '10px', width: '500px', margin: '20px auto', fontSize: '16px', lineHeight: '1.5', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
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
                    backgroundColor: message.role === 'user' ? '#0078d4' : '#e0e0e0',
                    color: message.role === 'user' ? 'white' : 'black',
                    textAlign: 'left',
                  }}
                >
                  <strong>{message.role === 'user' ? 'You' : 'Moneypenny'}:</strong>
                  <p style={{ margin: '5px 0 0' }}>{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ marginTop: '20px', textAlign: 'center', color: 'gray' }}>No conversation yet. Start by typing something!</p>
        )}
      </div>
    </div>
  );
}

export default MoneypennyProblemStatement;