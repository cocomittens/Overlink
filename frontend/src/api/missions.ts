const API_BASE = 'http://localhost:5000/api';

export const getMissions = async () => {
    const response = await fetch(`${API_BASE}/missions`);
    return response.json();
};

export const getUserMissions = async (userId: number) => {
    const response = await fetch(`${API_BASE}/users/${userId}/missions`);
    return response.json();
};

export const acceptMission = async (userId: number, missionId: number) => {
    const response = await fetch(`${API_BASE}/users/${userId}/missions/${missionId}/accept`, {
        method: 'POST'
    });
    return response.json();
};

export const completeMission = async (userId: number, missionId: number) => {
    const response = await fetch(`${API_BASE}/users/${userId}/missions/${missionId}/complete`, {
        method: 'POST'
    });
    return response.json();
};