import express from "express";
import { db } from "../../common/configs/db.config";

import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { Wrapper } from "../../common/middlewares/wrapper";
import { AuthMiddleware } from "../../common/middlewares/auth.middleware";

const authRepository = new AuthRepository(db);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

const router: express.Router = express.Router();

/**
 * 검증 API
 */

// 닉네임 유효 검증
router.post("/check/nickname", Wrapper(authController.existNickname));
// 이메일 유효 검증
router.post("/check/email", Wrapper(authController.existEmail));
// 로그인 ID 유효 검증
router.post("/check/loginid", Wrapper(authController.existLoginId));

// 유저 회원 생성
router.post("", Wrapper(authController.create));
// 로그인
router.post("/signin", Wrapper(authController.signIn));
// 로그아웃
router.post("/signout", AuthMiddleware, Wrapper(authController.signOut));

export default router;
