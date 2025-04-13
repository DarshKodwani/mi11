import React from 'react';
import './M_coverpage.css';

function MCoverPage({ setWorkflowStep }) {
  return (
    <div className="cover-page">
      <div className="agent-image-container">
        <img src="/images/M_.png" alt="M" className="agent-image" />
        <div className="thought-bubble-m">Welcome, Agent. Your mission is to uncover insights from the data. Proceed with caution.</div>
      </div>
      <h1>Welcome to Mi 11</h1>
      <p>Why did the data scientist break up with the graph? It just didn’t have enough points!</p>
      <button className="primary-button" onClick={() => setWorkflowStep(1)}>
        Let’s Crunch Some Numbers!
      </button>
    </div>
  );
}

export default MCoverPage;