import { atom } from "jotai";
import { Mission } from "../types/mission";
import { getMissions, getUserMissions, getNodeData } from "../api";

export const userAtom = atom<{
  id: number;
  username: string;
  money: number;
  rating: number;
} | null>(null);

const missionsRefreshAtom = atom(0);

const allMissionsAtom = atom<Promise<Mission[]>>(async (get) => {
  get(missionsRefreshAtom);
  return await getMissions();
});

export const currentMissionsAtom = atom<Promise<Mission[]>>(async (get) => {
  const user = get(userAtom);
  get(missionsRefreshAtom);
  if (!user) {
    return [];
  }
  return await getUserMissions(user.id);
});

export const missionsAtom = atom<Promise<Mission[]>>(async (get) => {
  const allMissions = await get(allMissionsAtom);
  const acceptedMissions = await get(currentMissionsAtom);
  const acceptedMissionIds = new Set(acceptedMissions.map((m) => m.id));
  return allMissions.filter((m) => !acceptedMissionIds.has(m.id));
});

export const refreshMissionsAtom = atom(null, (get, set) => {
  set(missionsRefreshAtom, (prev) => prev + 1);
});

export const chainAtom = atom<string[]>(["personal_gateway"]);
export const currentNodeAtom = atom<string | null>(null);

export const nodesAtom = atom<any[]>([]);

export const dataAtom = atom<Promise<any[]>>(async () => {
  return await getNodeData();
});

export const directoryAtom = atom<{
  id: string;
  name: string;
  data: { name: string; data: string[] }[];
}>({ id: "", name: "", data: [] });

export const moneyAtom = atom(1000);
export const ratingAtom = atom(13);

export const softwareAtom = atom([
  { id: "trace_tracker", name: "Trace Monitor", version: 2 },
  { id: "password_breaker", name: "Password Cracker", version: 1 },
]);

export const currentSoftwareAtom = atom<Set<string>>(new Set<string>());

export const traceAtom = atom<number>(0);

export const traceTimeAtom = atom<number>(0);
