import React, { useState } from 'react';

const MultiModalUpload = () => {
    const [file, setFile] = useState(null);

    const handleUpload = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className="upload-container">
            <h2>Upload Medical Data</h2>
            <input type="file" onChange={handleUpload} />
            {file && <p>Selected: {file.name}</p>}
        </div>
    );
};

export default MultiModalUpload;
