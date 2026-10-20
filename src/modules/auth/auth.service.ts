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

    return this.createSession(user.id, user.role);
  }

  async login(input: LoginInput): Promise<AuthResult> {
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

    return this.createSession(user.id, user.role);
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
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

    const tokenHash = hashRefreshToken(refreshToken);

    const redisKey = this.getRefreshTokeKey(payload.sessionId);

    const storedHash = await redis.get(redisKey);

    if (!storedHash) {
      throw new AppError(
        401,
        "REFRESH_TOKEN_REVOKED",
        "Invalid or expired refresh token",
      );
    }

    if (tokenHash !== storedHash) {
      // posible token reuse
      await redis.del(redisKey);
      throw new AppError(
        401,
        "REFRESH_TOKEN_REUSE_DETECTED",
        "Invalid refresh token",
      );
    }

    const user = await userRepository.findById(payload.sub);

    if (!user) {
      await redis.del(redisKey);
      throw new AppError(
        401,
        "REFRESH_TOKEN_REUSE_DETECTED",
        "Invalid refresh token",
      );
    }

    //rotate refresh token
    await redis.del(redisKey);
    return this.createSession(user.id, user.role);
  }

  async logout(refreshToke: string): Promise<void> {
    try {
      const payload = verifyRefreshToken(refreshToke);

      if (payload.type !== "refresh") {
        return;
      }

      await redis.del(this.getRefreshTokeKey(payload.sessionId));
    } catch {
      return;
    }
  }

  private async createSession(
    userId: string,
    role: string,
  ): Promise<AuthResult> {
    const sessionId = randomUUID();
    const refreshToken = signRefreshToken({
      sub: userId,
      sessionId,
      type: "refresh",
    });

    const refreshTokenHash = hashRefreshToken(refreshToken);

    await redis.set(this.getRefreshTokeKey(sessionId), refreshTokenHash, {
      EX: env.REFRESH_TOKEN_TTL_SECONDS,
    });

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
