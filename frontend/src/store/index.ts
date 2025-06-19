import { atom } from 'jotai';

export const chainAtom = atom<string[]>(['personal_gateway']);
export const currentNodeAtom = atom<string | null>(null);