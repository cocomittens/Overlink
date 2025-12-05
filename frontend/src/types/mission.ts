export type TraceProfileId = "low" | "medium" | "high" | "insane";

export interface TraceProfile {
  id: TraceProfileId;
  baseSeconds: number;
  actionPenalty: number;
  accelFactor: number;
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
  traceProfileId?: TraceProfileId;
};
