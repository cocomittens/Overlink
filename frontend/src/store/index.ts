import { atom } from "jotai";
import { Mission, TraceProfileId } from "../types/mission";
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
  completedMissions?: number;
} | null>(null);

const missionsRefreshAtom = atom(0);

const allMissionsAtom = atom<Promise<Mission[]>>(async (get) => {
  get(missionsRefreshAtom);
  return await getMissions();
});

const userMissionsAtom = atom<Promise<(Mission & { status?: string })[]>>(async (get) => {
  const user = get(userAtom);
  get(missionsRefreshAtom);
  if (!user) {
    return [];
  }
  return await getUserMissions(user.id);
});

export const currentMissionsAtom = atom<Promise<Mission[]>>(async (get) => {
  const all = await get(userMissionsAtom);
  return all.filter((m) => m.status === "accepted");
});

export const missionsAtom = atom<Promise<Mission[]>>(async (get) => {
  const allMissions = await get(allMissionsAtom);
  const userMissions = await get(userMissionsAtom);
  const userMissionIds = new Set(userMissions.map((m) => m.id));
  return allMissions.filter((m) => !userMissionIds.has(m.id));
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

const moneyBaseAtom = atom(readStorage("money", 1000));
export const moneyAtom = atom(
  (get) => get(moneyBaseAtom),
  (_get, set, value: number) => {
    set(moneyBaseAtom, value);
    writeStorage("money", value);
  }
);
export const ratingAtom = atom(13);

export const initialSoftware = [
  { id: "trace_tracker", name: "Trace Monitor", version: 1 },
  { id: "password_breaker", name: "Password Cracker", version: 1 },
  { id: "file_copier", name: "Copier", version: 1 },
  { id: "file_deleter", name: "Deleter", version: 1 },
];

const softwareBaseAtom = atom(readStorage("software", initialSoftware));
export const softwareAtom = atom(
  (get) => get(softwareBaseAtom),
  (_get, set, value: typeof initialSoftware) => {
    set(softwareBaseAtom, value);
    writeStorage("software", value);
  }
);

export type ShopItem = {
  id: number;
  name: string;
  description: string;
  price: number;
};

export const initialShopItems: ShopItem[] = [
  {
    id: 1,
    name: "Undeleter",
    description: "Undeletes deleted files",
    price: 1000,
  },
  {
    id: 3,
    name: "Password Cracker v2",
    description: "Makes password cracker faster.",
    price: 1000,
  },
  {
    id: 4,
    name: "Trace Monitor v2",
    description: "Displays remaining trace time in seconds instead of percentage.",
    price: 420,
  },
];

const shopItemsBaseAtom = atom(readStorage<ShopItem[]>("shopItems", initialShopItems));
export const shopItemsAtom = atom(
  (get) => get(shopItemsBaseAtom),
  (_get, set, value: ShopItem[]) => {
    set(shopItemsBaseAtom, value);
    writeStorage("shopItems", value);
  }
);

const currentSoftwareBaseAtom = atom<Set<string>>(
  new Set(readStorage<string[]>("currentSoftware", []))
);

export const currentSoftwareAtom = atom(
  (get) => get(currentSoftwareBaseAtom),
  (get, set, value: Set<string> | ((prev: Set<string>) => Set<string>)) => {
    const next =
      typeof value === "function"
        ? (value as (prev: Set<string>) => Set<string>)(get(currentSoftwareBaseAtom))
        : value;
    set(currentSoftwareBaseAtom, next);
    writeStorage("currentSoftware", Array.from(next));
  }
);

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

export type TraceState = {
  active: boolean;
  progress: number; // 0-100
  profileId: TraceProfileId | null;
};

const traceStateBaseAtom = atom<TraceState>(
  readStorage<TraceState>("traceState", {
    active: false,
    progress: 0,
    profileId: null,
  })
);

export const traceStateAtom = atom(
  (get) => get(traceStateBaseAtom),
  (
    get,
    set,
    value: TraceState | ((prev: TraceState) => TraceState)
  ) => {
    const next =
      typeof value === "function"
        ? (value as (prev: TraceState) => TraceState)(get(traceStateBaseAtom))
        : value;
    set(traceStateBaseAtom, next);
    writeStorage("traceState", next);
  }
);

export const soundEnabledAtom = atom<boolean>(true);

export const selectedFileAtom = atom<{
  name: string;
  location?: string;
} | null>(null);

type DeletedServerFile = {
  location: string;
  name: string;
  values: string[];
};

const deletedServerFilesBaseAtom = atom<DeletedServerFile[]>(
  readStorage("deletedServerFiles", [])
);

export const deletedServerFilesAtom = atom(
  (get) => get(deletedServerFilesBaseAtom),
  (get, set, value: DeletedServerFile[] | ((prev: DeletedServerFile[]) => DeletedServerFile[])) => {
    const next =
      typeof value === "function" ? (value as (prev: DeletedServerFile[]) => DeletedServerFile[])(get(deletedServerFilesBaseAtom)) : value;
    set(deletedServerFilesBaseAtom, next);
    writeStorage("deletedServerFiles", next);
  }
);
