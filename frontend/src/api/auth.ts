const API_BASE = 'http://localhost:5000/api';

export const login = async (username: string, password: string) => {
    const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    });
    return response.json();
};

