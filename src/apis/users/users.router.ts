import express from "express";
import { db } from "../../common/configs/db.config";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersRepository } from "./users.repository";

const router: express.Router = express.Router();

const usersRepository = new UsersRepository(db);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

// 유저 마이페이지 조회
router.get("/mypage", usersController.myPage);

export default router;
