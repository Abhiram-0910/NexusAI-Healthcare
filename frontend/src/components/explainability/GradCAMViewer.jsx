import React from 'react';

const GradCAMViewer = ({ heatmapUrl }) => {
    return (
        <div className="grad-cam-viewer">
            <h3>Grad-CAM Heatmap</h3>
            {heatmapUrl ? <img src={heatmapUrl} alt="Heatmap" /> : <p>No heatmap available</p>}
        </div>
    );
};

export default GradCAMViewer;
