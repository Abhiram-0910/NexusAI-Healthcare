import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const DemographicChart = ({ data }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="demographic-chart">
            <h3>Demographic Distribution</h3>
            <PieChart width={300} height={300}>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </div>
    );
};

export default DemographicChart;
