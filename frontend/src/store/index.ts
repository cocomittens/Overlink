import { atom } from 'jotai';

export const chainAtom = atom<string[]>(['personal_gateway']);
export const currentNodeAtom = atom<string | null>('sample_internal');

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
            { id: "view_logs", name: "View Logs", data: [{ name: 'Action', data: ['log_2023_10_01', 'log_2023_10_02', 'log_2023_10_03'] }] },
        ]
    }
]);

export const directoryAtom = atom<{ id: string, name: string, data: { name: string, data: string[] }[] }>({ id: "", name: "", data: [] });

export const moneyAtom = atom(1000);