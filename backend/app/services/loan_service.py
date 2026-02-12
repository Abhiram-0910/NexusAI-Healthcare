class LoanEligibilityChecker:
    def __init__(self):
        self.govt_schemes = [
            {
                "name": "Ayushman Bharat - PMJAY",
                "coverage": "₹5,00,000",
                "eligibility": "BPL families",
                "income_limit": 250000,
                "interest_rate": "0%"
            },
            {
                "name": "Senior Citizen Health Insurance",
                "coverage": "₹1,50,000",
                "eligibility": "Age > 60",
                "income_limit": 500000,
                "interest_rate": "4%"
            }
        ]
    
    def check_eligibility(self, annual_income, treatment_cost):
        eligible_schemes = []
        for scheme in self.govt_schemes:
            if annual_income <= scheme.get('income_limit', float('inf')):
                eligible_schemes.append({
                    "name": scheme['name'],
                    "coverage": scheme['coverage'],
                    "interest_rate": scheme['interest_rate']
                })
        
        max_eligible = min(annual_income * 3, 500000)
        is_eligible = treatment_cost <= max_eligible
        
        return {
            "eligible": is_eligible,
            "status": "APPROVED" if is_eligible else "REVIEW",
            "max_eligible_amount": max_eligible,
            "max_amount": max_eligible,
            "government_schemes": eligible_schemes[:2],
            "matchedSchemes": [s['name'] for s in eligible_schemes[:2]],
            "eligibleAmount": max_eligible,
            "emiPerMonth": round((treatment_cost * 1.08) / 12) if treatment_cost <= max_eligible else 0,
            "interestRate": "8%",
            "quickApproval": annual_income > 30000
        }
