import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const SHAPChart = ({ data }) => {
    return (
        <div className="shap-chart">
            <h3>SHAP Values</h3>
            <BarChart width={400} height={300} data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
        </div>
    );
};

export default SHAPChart;
