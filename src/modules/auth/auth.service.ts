import { UserRepository } from "../../repositories/user.repository";
import { prisma } from "../../config/prisma";
import { AppError } from "../../errors/appError";
import { comparePassword, hashPassword } from "../../utils/password";
import { randomUUID } from "crypto";
import { hashRefreshToken } from "../../utils/refreshToken";
import { redis } from "../../config/redis";
import { env } from "../../config/env";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { createRefreshSession, deleteRefreshSession, getRefreshSession, updateRefreshSession } from "../../utils/authSession";

const userRepository = new UserRepository(prisma);

interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface SessionMetadata {
  userAgent?: string;
  ip?: string;
}

interface AuthResult {
  accessToken: string;
  refreshToken: string;
}

const REFRESH_SESSION_TTL = env.REFRESH_TOKEN_TTL_SECONDS;

export class AuthService {
  async register(
    input: RegisterInput,
    metadata: SessionMetadata,
  ): Promise<AuthResult> {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError(
        409,
        "EMAIL_ALREADY_REGISTERD",
        "Unable to create account with the provided information!",
      );
    }

    const passwordHash = await hashPassword(input.password);

    const user = await userRepository.create({
      email: input.email,
      passwordHash,
      name: input.name,
    });

    return this.createSession(user.id, user.role,metadata);
  }

  async login(input: LoginInput,metadata:SessionMetadata): Promise<AuthResult> {
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError(
        401,
        "INVALID_CREDENTIALS",
        "Invalid email or password",
      );
    }

    const passwordMatches = await comparePassword(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new AppError(
        401,
        "INVALID_CREDENTIALS",
        "Invalid email or password",
      );
    }

    return this.createSession(user.id, user.role,metadata);
  }

  async refresh(refreshToken: string,metadata:SessionMetadata): Promise<AuthResult> {
    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError(
        401,
        "INVALID_REFRESH_TOKEN",
        "Invalid or expired refresh token",
      );
    }

    if (payload.type !== "refresh") {
      throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
    }

    const session = await getRefreshSession(payload.sessionId);

    if (!session) {
      throw new AppError(401,"SESSION_REVOKED","Session is not longer valid")
    }

    if (session.userId !== payload.sub) {
      await deleteRefreshSession(payload.sessionId)
      throw new AppError(401,"INVALID_REFRESH_SESSION","Invalid refresh session")
    }



    const tokenHash = hashRefreshToken(refreshToken);

    if (tokenHash !== session.tokenHash) {
      await deleteRefreshSession(payload.sessionId)
      throw new AppError(401,"REFRESH_TOKEN_REUSE_DETECTED","Invalid refresh token")
    }

    const user = await userRepository.findById(payload.sub);

    if (!user) {
      await deleteRefreshSession(payload.sessionId);
      throw new AppError(
        401,
        "USER_NOT_FOUND",
          "User no longer exists",
      );
    }

    // keep the same session id only rotate the token

    const newrefreshToken = signRefreshToken({
      sub: user.id,
      sessionId: payload.sessionId,
      type:"refresh"
    })

    const newTokenHash = hashRefreshToken(newrefreshToken)

    await updateRefreshSession(payload.sessionId, {
      ...session,
      tokenHash: newTokenHash,
      lastUsedAt: new Date().toISOString(),
      ip: metadata.ip ?? session.ip,
      userAgent:metadata.userAgent ?? session.userAgent
    })

    //rotate refresh token
    // await deleteRefreshSession(payload.sessionId)
    // return this.createSession(user.id, user.role, {
    //   ...metadata
    // });
    //
    const accessToken =
       signAccessToken({
         sub: user.id,
         role: user.role,
         type: "access",
       });

     return {
       accessToken,
       refreshToken:newrefreshToken,
     };
  }

  async logout(refreshToke: string): Promise<void> {
    try {
      const payload = verifyRefreshToken(refreshToke);

      if (payload.type !== "refresh") {
        return;
      }

      await deleteRefreshSession(payload.sessionId)
    } catch {
      return;
    }
  }

  async logoutAll(userId: string): Promise<void>{
    const pattern = `${"auth:session"}:*`;

    let cursor = 0

    do {
      const result = await redis.scan(cursor, {
        MATCH: pattern,
        COUNT:100
      })

      cursor = result.cursor

      const keys = result.keys

      if (keys.length === 0) {
        continue
      }

      const sessions = await redis.mGet(keys)

      const keysToDelete: string[] = []
      for (let i = 0; i < sessions.length; i++){
        const value = sessions[i]
        if (!value) { continue }

        try {
          const session = JSON.parse(value)

          if (session.userId === userId) {
            keysToDelete.push(
                         keys[i],
                       );
          }
        } catch {

        }
      }

      if (keysToDelete.length > 0) {
        await redis.del(keysToDelete)
      }

    } while(cursor !== 0)
  }


  private async createSession(
    userId: string,
    role: string,
    metadata:SessionMetadata
  ): Promise<AuthResult> {
    const sessionId = randomUUID();
    const refreshToken = signRefreshToken({
      sub: userId,
      sessionId,
      type: "refresh",
    });

    const refreshTokenHash = hashRefreshToken(refreshToken);

    const now = new Date().toISOString()

    await createRefreshSession(sessionId, {
      userId,
      tokenHash:refreshTokenHash,
      createdAt: now,
      lastUsedAt: now,
      userAgent: metadata.userAgent,
      ip:metadata.ip
    })

    // await redis.set(this.getRefreshTokeKey(sessionId), refreshTokenHash, {
    //   EX: env.REFRESH_TOKEN_TTL_SECONDS,
    // });

    const accessToken = signAccessToken({
      sub: userId,
      role,
      type: "access",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private getRefreshTokeKey(sessionId: string): string {
    return `auth:refresh:${sessionId}`;
  }
}
