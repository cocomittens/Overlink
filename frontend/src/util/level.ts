export const LEVEL_XP_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 100,
  3: 200,
  4: 400,
  5: 800,
  6: 1600,
  7: 3200,
  8: 6400,
};

export const calculateLevelProgress = (totalXp: number) => {
  const sorted = Object.entries(LEVEL_XP_THRESHOLDS)
    .map(([lvl, xp]) => ({ level: Number(lvl), xp }))
    .sort((a, b) => a.level - b.level);

  let level = 1;
  for (let i = 0; i < sorted.length; i++) {
    if (totalXp >= sorted[i].xp) {
      level = sorted[i].level;
    } else {
      break;
    }
  }

  const currentThreshold =
    sorted.find((item) => item.level === level)?.xp ?? 0;
  const nextThreshold =
    sorted.find((item) => item.level === level + 1)?.xp ?? null;

  const progress =
    nextThreshold === null
      ? 1
      : Math.max(
          0,
          Math.min(1, (totalXp - currentThreshold) / (nextThreshold - currentThreshold))
        );

  return { level, progress };
};
