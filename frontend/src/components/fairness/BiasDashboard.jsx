import React from 'react';

const BiasDashboard = ({ metrics }) => {
    return (
        <div className="bias-dashboard">
            <h3>Fairness Metrics</h3>
            <ul>
                <li>Demographic Parity: {metrics?.parity || 'N/A'}</li>
                <li>Equal Opportunity: {metrics?.opportunity || 'N/A'}</li>
            </ul>
        </div>
    );
};

export default BiasDashboard;
