import React from 'react';
import './Q_data.css';

function QData({ setWorkflowStep }) {
  return (
    <div className="agent-image-container-q" style={{ position: 'relative', height: '100vh' }}>
      <img src="/images/Q_.png" alt="Q" className="agent-image" style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
      <div className="thought-bubble-q" style={{ position: 'absolute', top: '20%', left: 'calc(50% + 2cm)' }}>
        Ah, the tools and data! The right data is like the right gadget—it makes all the difference!
      </div>
      <button className="primary-button" onClick={() => setWorkflowStep(3)} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        Proceed to Analysis Plan
      </button>
    </div>
  );
}

export default QData;