import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { env } from "../../config/env";
import { AppError } from "../../errors/appError";

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


const getSessionMetadata = (req: Request) => {
  return {
    ip: req.ip,
    userAgent:req.get("user-agent") ?? undefined
  }
}



export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const result = await authService.register(req.body,getSessionMetadata(req));

    setRefrehTokenCookie(res, result.refreshToken);

    res.status(201).json({
      success: true,
      data: {
        accessToken: result.accessToken,
      },
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    const result = await authService.login(req.body,getSessionMetadata(req));

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

    const result = await authService.refresh(refreshToken,getSessionMetadata(req));

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


  async logoutAll(req: Request, res: Response): Promise<void>{
    if (!req.user) {
      throw new AppError(401,"UNAUTHORIZED","Authentication required")
    }

    await authService.logoutAll(req.user.id)

    clearRefreshTokenCookie(res)

    res.status(204).send()
  }
}
