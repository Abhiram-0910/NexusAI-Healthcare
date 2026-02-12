import React from 'react';

const GovtSchemes = () => {
    const schemes = [
        { name: "Ayushman Bharat", description: "Health insurance for the poor" },
        { name: "PM Jan Arogya Yojana", description: "Financial protection" }
    ];

    return (
        <div className="govt-schemes">
            <h3>Government Schemes</h3>
            <ul>
                {schemes.map((s, i) => (
                    <li key={i}>
                        <strong>{s.name}</strong>: {s.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GovtSchemes;
