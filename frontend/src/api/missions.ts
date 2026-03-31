import { Mission } from "../types/mission";
import { API_BASE } from "./config";

export const getMissions = async (): Promise<Mission[]> => {
  const response = await fetch(`${API_BASE}/missions`);
  return response.json();
};

export const getUserMissions = async (userId: number): Promise<Mission[]> => {
  const response = await fetch(`${API_BASE}/users/${userId}/missions`);
  return response.json();
};

export const acceptMission = async (userId: number, missionId: number) => {
  const response = await fetch(
    `${API_BASE}/users/${userId}/missions/${missionId}/accept`,
    {
      method: "POST",
    }
  );
  return response.json();
};

export const completeMission = async (userId: number, missionId: number) => {
  const response = await fetch(
    `${API_BASE}/users/${userId}/missions/${missionId}/complete`,
    {
      method: "POST",
    }
  );
  return response.json();
};

export const resetMissions = async (userId: number) => {
  const response = await fetch(
    `${API_BASE}/users/${userId}/missions/reset`,
    {
      method: "POST",
    }
  );
  return response.json();
};

export const abandonMission = async (userId: number, missionId: number) => {
  const response = await fetch(
    `${API_BASE}/users/${userId}/missions/${missionId}/abandon`,
    {
      method: "DELETE",
    }
  );
  return response.json();
};
