import React, { useEffect, useState } from 'react';

const RealTimeVitals = () => {
    const [vitals, setVitals] = useState({ heartRate: 72, oxygen: 98 });

    useEffect(() => {
        const interval = setInterval(() => {
            setVitals({
                heartRate: 70 + Math.floor(Math.random() * 10),
                oxygen: 95 + Math.floor(Math.random() * 5)
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="vitals-monitor">
            <h3>Real-Time Vitals</h3>
            <p>Heart Rate: {vitals.heartRate} bpm</p>
            <p>Oxygen Level: {vitals.oxygen}%</p>
        </div>
    );
};

export default RealTimeVitals;
