import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { env } from "../../config/env";

const authService = new AuthService();

const setRefrehTokenCookie = (res: Response, refreshToken: string): void => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    maxAge: env.REFRESH_TOKEN_TTL_SECONDS * 1000,
    path: "/api/v1/auth",
  });
};

const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: "/api/v1/auth",
  });
};

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const result = await authService.register(req.body);

    setRefrehTokenCookie(res, result.refreshToken);

    res.status(201).json({
      success: true,
      data: {
        accessToken: result.accessToken,
      },
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    const result = await authService.login(req.body);

    setRefrehTokenCookie(res, result.refreshToken);

    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
      },
    });
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies.refreshToken ?? req.body.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: {
          code: "REFRESH_TOKEN_REQUIRED",
          message: "Refresh token is required",
        },
      });
      return;
    }

    const result = await authService.refresh(refreshToken);

    setRefrehTokenCookie(res, result.refreshToken);

    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
      },
    });
  }

  async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies.refreshToken ?? req.body.refreshToken;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    clearRefreshTokenCookie(res);

    res.status(204).send();
  }
}
