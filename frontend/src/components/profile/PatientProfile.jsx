import React from 'react';

const PatientProfile = ({ user }) => {
    return (
        <div className="patient-profile">
            <h3>Patient Profile</h3>
            <p>Name: {user?.name || 'John Doe'}</p>
            <p>Age: {user?.age || 'N/A'}</p>
            <p>ID: {user?.id || 'N/A'}</p>
        </div>
    );
};

export default PatientProfile;
