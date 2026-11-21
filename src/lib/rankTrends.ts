export interface RankTrendItem {
  currentRank: number;
  prevRank: number | null;
  diff: number;
  trend: 'up' | 'down' | 'same' | 'pending';
}

export interface RankTrendsResult {
  isSessionInProgress: boolean;
  remainingMinutes: number;
  sessionStartTime: string | null;
  latestTxTime: string | null;
  userTrends: Map<string, RankTrendItem>;
}

export function calculateRankTrends(
  userIds: string[],
  transactions: { user_id: string; points_added: number; created_at: string }[] | null | undefined,
  cookieSettledAtTimestamp?: number | null,
  now: number = Date.now()
): RankTrendsResult {
  const SESSION_GAP_MS = 4 * 60 * 60 * 1000; // 4 hours defines a new gathering session
  const SETTLE_DELAY_MS = 90 * 60 * 1000; // 90 minutes cooldown after the latest point award

  const defaultUserTrends = new Map<string, RankTrendItem>();
  userIds.forEach(id => {
    defaultUserTrends.set(id, {
      currentRank: 1,
      prevRank: null,
      diff: 0,
      trend: 'same',
    });
  });

  if (!transactions || transactions.length === 0) {
    return {
      isSessionInProgress: false,
      remainingMinutes: 0,
      sessionStartTime: null,
      latestTxTime: null,
      userTrends: defaultUserTrends,
    };
  }

  // Sort transactions chronologically
  const sortedTxs = [...transactions].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const latestTxTimeMs = new Date(sortedTxs[sortedTxs.length - 1].created_at).getTime();
  const timeSinceLatest = now - latestTxTimeMs;

  // Determine if session is settled
  const isCookieFinalized = Boolean(cookieSettledAtTimestamp && cookieSettledAtTimestamp >= latestTxTimeMs);
  const isAutoSettled = timeSinceLatest >= SETTLE_DELAY_MS;
  const isSessionInProgress = !isCookieFinalized && !isAutoSettled;
  const remainingMinutes = Math.max(0, Math.ceil((SETTLE_DELAY_MS - timeSinceLatest) / 60000));

  // Determine when the current session started (first transaction after a >4h gap)
  let sessionStartTimeMs = latestTxTimeMs;
  for (let i = sortedTxs.length - 1; i >= 1; i--) {
    const currTime = new Date(sortedTxs[i].created_at).getTime();
    const prevTime = new Date(sortedTxs[i - 1].created_at).getTime();
    if (currTime - prevTime > SESSION_GAP_MS) {
      sessionStartTimeMs = currTime;
      break;
    } else {
      sessionStartTimeMs = prevTime;
    }
  }

  // Calculate current totals and baseline (pre-session) totals
  const currentTotals = new Map<string, number>();
  const preSessionTotals = new Map<string, number>();

  userIds.forEach(id => {
    currentTotals.set(id, 0);
    preSessionTotals.set(id, 0);
  });

  sortedTxs.forEach(tx => {
    const txTime = new Date(tx.created_at).getTime();
    currentTotals.set(tx.user_id, (currentTotals.get(tx.user_id) || 0) + tx.points_added);
    if (txTime < sessionStartTimeMs) {
      preSessionTotals.set(tx.user_id, (preSessionTotals.get(tx.user_id) || 0) + tx.points_added);
    }
  });

  // Calculate unique scores for standard dense ranking
  const currentUniqueScores = Array.from(new Set(currentTotals.values())).sort((a, b) => b - a);
  const prevUniqueScores = Array.from(new Set(preSessionTotals.values())).sort((a, b) => b - a);

  const hasPreSessionData = sortedTxs.some(
    tx => new Date(tx.created_at).getTime() < sessionStartTimeMs
  );

  const userTrends = new Map<string, RankTrendItem>();

  userIds.forEach(id => {
    const curScore = currentTotals.get(id) || 0;
    const currentRank = currentUniqueScores.indexOf(curScore) + 1;

    if (isSessionInProgress) {
      userTrends.set(id, {
        currentRank,
        prevRank: null,
        diff: 0,
        trend: 'pending',
      });
      return;
    }

    if (!hasPreSessionData) {
      userTrends.set(id, {
        currentRank,
        prevRank: null,
        diff: 0,
        trend: 'same',
      });
      return;
    }

    const prevScore = preSessionTotals.get(id) || 0;
    const prevRank = prevUniqueScores.indexOf(prevScore) + 1;
    const rankDiff = prevRank - currentRank; // positive = moved up in ranking

    let trend: 'up' | 'down' | 'same' = 'same';
    if (rankDiff > 0) trend = 'up';
    else if (rankDiff < 0) trend = 'down';

    userTrends.set(id, {
      currentRank,
      prevRank,
      diff: Math.abs(rankDiff),
      trend,
    });
  });

  return {
    isSessionInProgress,
    remainingMinutes,
    sessionStartTime: new Date(sessionStartTimeMs).toISOString(),
    latestTxTime: new Date(latestTxTimeMs).toISOString(),
    userTrends,
  };
}
