import React, { useState } from 'react';

const LoanCalculator = () => {
    const [amount, setAmount] = useState(0);
    const [interest, setInterest] = useState(0);

    const calculate = () => {
        setInterest(amount * 0.05); // Dummy calculation
    };

    return (
        <div className="loan-calculator">
            <h3>Loan Calculator</h3>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Loan Amount" />
            <button onClick={calculate}>Calculate Interest</button>
            <p>Estimated Interest: {interest}</p>
        </div>
    );
};

export default LoanCalculator;
