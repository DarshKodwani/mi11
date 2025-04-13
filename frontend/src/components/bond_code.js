import React from 'react';
import './bond_code.css';

function BondCode() {
  return (
    <div className="agent-image-container-bond" style={{ position: 'relative', height: '100vh' }}>
      <img src="/images/007.png" alt="Bond" className="agent-image" style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
      <div className="thought-bubble-bond" style={{ position: 'absolute', top: '20%', left: 'calc(50% + 2cm)' }}>
        Mission accomplished! Let’s review the results and celebrate success!
      </div>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <h2>Generated Code</h2>
        <pre style={{ textAlign: 'left', backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
          {`import pandas as pd\nfrom sklearn.linear_model import LinearRegression\n\n# Load data\ndata = pd.read_csv('data.csv')\n\n# Feature engineering\ndata['seasonal_trend'] = ...\n\n# Train model\nmodel = LinearRegression()\nmodel.fit(data[['marketing_spend', 'seasonal_trend']], data['sales'])`}
        </pre>
      </div>
    </div>
  );
}

export default BondCode;