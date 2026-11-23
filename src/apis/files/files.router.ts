import express from "express";
import { db } from "../../common/configs/db.config";

import { Wrapper } from "../../common/middlewares/wrapper";
import { FilesRepository } from "./files.repository";
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";

const router: express.Router = express.Router();

const filesRepository = new FilesRepository(db);
const filesService = new FilesService(filesRepository);
const filesController = new FilesController(filesService);

// 폴더 생성
router.post("/new/folder", Wrapper(filesController.createFolder));
// 파일 업로드
router.post("/upload", Wrapper(filesController.uploads));
// 파일 다운로드
router.post("/download", Wrapper(filesController.download));
// 파일 목록 전체 조회
router.get("", Wrapper(filesController.getDatas));
// 파일명 수정
router.patch(
  "/rename/:id",

  Wrapper(filesController.updateRenameFile),
);
// 해당 파일 삭제
router.delete("/:id", Wrapper(filesController.deleteFile));
export default router;
