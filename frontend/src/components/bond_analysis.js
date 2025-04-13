import React from 'react';
import './bond_analysis.css';

function BondAnalysis({ setWorkflowStep }) {
  return (
    <div className="agent-image-container-bond" style={{ position: 'relative', height: '100vh' }}>
      <img src="/images/007.png" alt="Bond" className="agent-image" style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
      <div className="thought-bubble-bond" style={{ position: 'absolute', top: '20%', left: 'calc(50% + 2cm)' }}>
        Time to roll up our sleeves and get to work. Let’s make it happen!
      </div>
      <button className="primary-button" onClick={() => setWorkflowStep(4)} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        Proceed to Code Generation
      </button>
    </div>
  );
}

export default BondAnalysis;