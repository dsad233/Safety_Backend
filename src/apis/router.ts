import express from "express";

import AuthRouter from "./auth/auth.router";
import FilesRouter from "./files/files.router";
import UsersRouter from "./users/users.router";

import { AuthMiddleware } from "../common/middlewares/auth.middleware";

const router: express.Router = express.Router();

router.use("/auth", AuthRouter);
router.use("/files", AuthMiddleware, FilesRouter);
router.use("/users", AuthMiddleware, UsersRouter);

export default router;
