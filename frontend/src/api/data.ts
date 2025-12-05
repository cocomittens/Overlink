import { API_BASE } from "./config";

export const getNodeData = async () => {
    const response = await fetch(`${API_BASE}/data`);
    return response.json();
};
