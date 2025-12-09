export type TraceProfileId = "low" | "medium" | "high" | "insane";

export interface TraceProfile {
  id: TraceProfileId;
  baseSeconds: number;
  actionPenalty: number;
  accelFactor: number;
}

export const TRACE_PROFILES: Record<TraceProfileId, TraceProfile> = {
  low: { id: "low", baseSeconds: 120, actionPenalty: 3, accelFactor: 1.0 },
  medium: { id: "medium", baseSeconds: 90, actionPenalty: 5, accelFactor: 1.2 },
  high: { id: "high", baseSeconds: 60, actionPenalty: 8, accelFactor: 1.4 },
  insane: { id: "insane", baseSeconds: 45, actionPenalty: 12, accelFactor: 1.6 },
};

export interface MissionTarget {
  nodeId: string;
  objective: "copy" | "delete" | "crack" | "scan" | "upload" | "report";
  filePattern?: string;
  adminRequired?: boolean;
}

export type Mission = {
  id: number;
  title: string;
  date: string;
  payment: number;
  difficulty: number;
  minRating: number;
  employer: string;
  description: string;
  traceProfileId?: TraceProfileId; // deprecated; trace now tied to node
  targets?: MissionTarget[];
};
