import { env } from "../config/env";
import { redis } from "../config/redis";
import { RefreshSession } from "../types/auth";



const SESSION_PREFIX = "auth:session";

export const getSessionKey = (sessionId: string): string => {
  return `${SESSION_PREFIX}:${sessionId}`
}


export const createRefreshSession = async (sessionId: string, session: RefreshSession): Promise<void> => {
  await redis.set(getSessionKey(sessionId), JSON.stringify(session), {
    EX:env.REFRESH_TOKEN_TTL_SECONDS
  })
}


export const getRefreshSession = async (sessionId: string): Promise<RefreshSession | null> => {
  const value = await redis.get(getSessionKey(sessionId))

  if (!value) {
    return null
  }

  return JSON.parse(value) as RefreshSession
}

export const deleteRefreshSession = async (sessionId: string): Promise<void> => {
  await redis.del(getSessionKey(sessionId))
}

export const updateRefreshSession = async (
  sessionId: string,
  session: RefreshSession,
): Promise<void> => {
  await redis.set(
    getSessionKey(sessionId),
    JSON.stringify(session),
    {
      EX: env.REFRESH_TOKEN_TTL_SECONDS,
    },
  );
};
