const API_BASE = 'http://localhost:5000/api';

export const getMapNodes = async () => {
    const response = await fetch(`${API_BASE}/nodes`);
    return response.json();
};