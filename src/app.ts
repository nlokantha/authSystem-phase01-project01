import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./errors/errorHandler";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import { notFoundHandler } from "./middlewares/notFound.middleware";

export const app = express();

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(cookieParser());
app.disable("x-powerd-by");

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
    },
  });
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);

app.use(notFoundHandler);

app.use(errorHandler);
