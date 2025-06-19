import { atom } from 'jotai';

export const chainAtom = atom<string[]>(['personal_gateway']);
export const currentNodeAtom = atom<string | null>(null);

// Atom to store all map nodes
export const nodesAtom = atom([
    { id: "personal_gateway", top: 280, left: 190, name: "Gateway", admin: true },
    { id: "sample_internal", top: 450, left: 350, name: "Sample Internal Services", account: true, password: "pass123" },
    { id: "sample_bank", top: 200, left: 250, name: "Sample International Bank", active: true, admin: true, password: "rosebud" },
    { id: "sample_public_access", top: 300, left: 800, name: "Sample Public Access Server" }
]);