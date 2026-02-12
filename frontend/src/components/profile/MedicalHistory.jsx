import React from 'react';

const MedicalHistory = ({ history }) => {
    return (
        <div className="medical-history">
            <h3>Medical History</h3>
            <ul>
                {history?.map((record, i) => (
                    <li key={i}>{record.date}: {record.diagnosis}</li>
                )) || <li>No history available</li>}
            </ul>
        </div>
    );
};

export default MedicalHistory;
