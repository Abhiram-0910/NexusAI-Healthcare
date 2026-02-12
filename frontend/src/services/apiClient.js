const API_BASE_URL = 'http://localhost:8000';

export const apiClient = {
    async healthCheck() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            return await response.json();
        } catch (error) {
            console.error('Backend not available:', error);
            return { status: 'degraded' };
        }
    },

    async registerPatient(patientData) {
        // Mock registration - in real app this would POST to backend
        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            success: true,
            patientId: `SEVA-${Math.floor(Math.random() * 10000)}`,
            ...patientData
        };
    },

    async diagnose(formData) {
        try {
            console.log('🚀 Sending diagnosis request to backend...');
            const response = await fetch(`${API_BASE_URL}/api/diagnose`, {
                method: 'POST',
                body: formData,
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Backend error:', errorText);
                throw new Error(`Backend returned ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Diagnosis successful:', result);
            return result;
        } catch (error) {
            console.error('💥 Diagnosis failed:', error);
            alert(`Diagnosis Error: ${error.message}. Check console for details.`);
            throw error;
        }
    },

    async getFairnessReport() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/fairness-report/all`);
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch fairness report:', error);
            throw error;
        }
    },

    async getAuditLogs() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/audit-logs`);
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
            throw error;
        }
    },

    async getPatientSummary(patientId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/patient/${encodeURIComponent(patientId)}`);
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch patient summary:', error);
            throw error;
        }
    },

    async post(url, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            return { data: result };
        } catch (error) {
            console.error('API POST error:', error);
            throw error;
        }
    },
};
