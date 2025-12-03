import { atom } from "jotai";
import { Mission } from "../types/mission";
import { getMissions, getUserMissions, getNodeData } from "../api";

const safeStorage = typeof localStorage !== "undefined" ? localStorage : null;

const readStorage = <T>(key: string, fallback: T): T => {
  if (!safeStorage) return fallback;
  try {
    const raw = safeStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = <T>(key: string, value: T | null) => {
  if (!safeStorage) return;
  try {
    if (value === null) {
      safeStorage.removeItem(key);
    } else {
      safeStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    /* ignore storage errors */
  }
};

export const userAtom = atom<{
  id: number;
  username: string;
  money: number;
  rating: number;
  xp: number;
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
const currentNodeBaseAtom = atom<string | null>(
  readStorage("currentNode", null)
);
export const currentNodeAtom = atom(
  (get) => get(currentNodeBaseAtom),
  (_get, set, value: string | null) => {
    set(currentNodeBaseAtom, value);
    writeStorage("currentNode", value);
  }
);

export const nodesAtom = atom<any[]>([]);

export const dataAtom = atom<Promise<any[]>>(async () => {
  return await getNodeData();
});

export type Directory = {
  id: string;
  name: string;
  data: { name: string; data: string[] }[];
  folders?: Directory[];
};

const directoryBaseAtom = atom<Directory>(
  readStorage("currentDirectory", { id: "", name: "", data: [] })
);

export const directoryAtom = atom(
  (get) => get(directoryBaseAtom),
  (_get, set, value: Directory) => {
    set(directoryBaseAtom, value);
    writeStorage("currentDirectory", value);
  }
);

export const moneyAtom = atom(1000);
export const ratingAtom = atom(13);

export const softwareAtom = atom([
  { id: "trace_tracker", name: "Trace Monitor", version: 2 },
  { id: "password_breaker", name: "Password Cracker", version: 1 },
  { id: "file_copier", name: "Copier", version: 1 },
  { id: "file_deleter", name: "Deleter", version: 1 },
]);

export const currentSoftwareAtom = atom<Set<string>>(new Set<string>());

const hardDriveBaseAtom = atom(
  readStorage("hardDrive", { capacity: 10, files: [] as string[] })
);
export const hardDriveAtom = atom(
  (get) => get(hardDriveBaseAtom),
  (
    get,
    set,
    value:
      | { capacity: number; files: string[] }
      | ((prev: { capacity: number; files: string[] }) => {
          capacity: number;
          files: string[];
        })
  ) => {
    const next =
      typeof value === "function"
        ? (
            value as (prev: { capacity: number; files: string[] }) => {
              capacity: number;
              files: string[];
            }
          )(get(hardDriveBaseAtom))
        : value;
    set(hardDriveBaseAtom, next);
    writeStorage("hardDrive", next);
  }
);

export const traceAtom = atom<number>(0);

export const traceTimeAtom = atom<number>(0);

export const soundEnabledAtom = atom<boolean>(true);

export const selectedFileAtom = atom<{
  name: string;
  location?: string;
} | null>(null);
