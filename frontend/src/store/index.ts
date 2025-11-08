import { atom } from 'jotai';
import { Mission } from "../types/mission";
import { getMissions, getUserMissions } from "../api";

export const userAtom = atom<{ id: number; username: string; money: number; rating: number } | null>(null);

const missionsRefreshAtom = atom(0);

const allMissionsAtom = atom<Promise<Mission[]>>(async (get) => {
    get(missionsRefreshAtom); // Subscribe to refresh trigger
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
    const acceptedMissionIds = new Set(acceptedMissions.map(m => m.id));
    return allMissions.filter(m => !acceptedMissionIds.has(m.id));
});

export const refreshMissionsAtom = atom(null, (get, set) => {
    set(missionsRefreshAtom, (prev) => prev + 1);
});

export const chainAtom = atom<string[]>(['personal_gateway']);
export const currentNodeAtom = atom<string | null>(null);

export const nodesAtom = atom([
    { id: "personal_gateway", top: 280, left: 190, name: "Gateway", admin: true },
    { id: "sample_internal", top: 500, left: 350, name: "Sample Internal Services", account: true, password: "pass123" },
    { id: "sample_bank", top: 200, left: 250, name: "Sample International Bank", active: true, admin: true, password: "rosebud" },
    { id: "sample_public_access", top: 300, left: 800, name: "Sample Public Access Server" }
]);

export const dataAtom = atom([
    {
        id: "sample_internal",
        name: "Sample Internal Services",
        directory: [
            { id: "file_server", name: "File Server", data: [{ name: 'Filename', data: ['sample_data_334', 'sample_data_1337', 'sample_data_42'] }] },
            { id: "view_logs", name: "View Logs", data: [{ name: 'Date', data: ['2023-10-01', '2023-10-02', '2023-10-03'] }, { name: 'Action', data: ['log_2023_10_01', 'log_2023_10_02', 'log_2023_10_03'] }] },
        ]
    }
]);

export const directoryAtom = atom<{ id: string, name: string, data: { name: string, data: string[] }[] }>({ id: "", name: "", data: [] });

export const moneyAtom = atom(1000);
export const ratingAtom = atom(13);

export const softwareAtom = atom([
    { id: "trace_tracker", name: "Trace Tracker", version: 2 },
    { id: "password_breaker", name: "Password Breaker", version: 1 }
]);

export const currentSoftwareAtom = atom<Set<string>>(new Set<string>());

export const traceAtom = atom<number>(0);

export const traceTimeAtom = atom<number>(0);