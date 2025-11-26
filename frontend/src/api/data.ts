const API_BASE = 'http://localhost:5000/api';

export const getNodeData = async () => {
    const response = await fetch(`${API_BASE}/data`);
    return response.json();
};
