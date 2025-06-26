import { atom } from 'jotai';
import { Mission } from "../types/mission";

export const missionsAtom = atom<Mission[]>([
    {
        id: 1,
        title: "Falsify a social security document",
        date: "2023-10-01",
        payment: 5300,
        difficulty: 4,
        minRating: 12,
    },
    {
        id: 2,
        title: "Find and destroy crucial data on a mainframe",
        date: "2023-10-02",
        payment: 1700,
        difficulty: 2,
        minRating: 14,
    },
    {
        id: 3,
        title: "Break into a rival computer system and sabotage files",
        date: "2023-10-03",
        payment: 1600,
        difficulty: 2,
        minRating: 15,
    },
]);

export const currentMissionsAtom = atom<Mission[]>([]);

export const chainAtom = atom<string[]>(['personal_gateway']);
export const currentNodeAtom = atom<string | null>(null);

export const nodesAtom = atom([
    { id: "personal_gateway", top: 40, left: 15, name: "Gateway", admin: true },
    { id: "sample_internal", top: 70, left: 30, name: "Sample Internal Services", account: true, password: "pass123" },
    { id: "sample_bank", top: 32, left: 27, name: "Sample International Bank", active: true, admin: true, password: "rosebud" },
    { id: "sample_public_access", top: 30, left: 60, name: "Sample Public Access Server" }
]);

export const dataAtom = atom([
    {
        id: "sample_internal",
        name: "Sample Internal Services",
        directory: [
            { id: "file_server", name: "File Server", data: [{ name: 'Filename', data: ['sample_data_334', 'sample_data_1337', 'sample_data_42'] }] },
            { id: "view_logs", name: "View Logs", data: [{ name: 'Date', data: ['2023-10-01', '2023-10-02', '2023-10-03'] }, { name: 'Action', data: ['Connection from 127.0.0.1 was closed', 'File sample_data_42 was accessed by 127.0.0.1', 'Connection from 127.0.0.1 was established'] }] },
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