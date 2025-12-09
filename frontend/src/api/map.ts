import { API_BASE } from "./config";

export const getMapNodes = async () => {
    const response = await fetch(`${API_BASE}/nodes`);
    return response.json();
};
