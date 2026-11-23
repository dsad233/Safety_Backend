import { MySql2Database } from "drizzle-orm/mysql2";
import { fileInfo, fileContent } from "../../../schema/schema";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  inArray,
  like,
  lte,
  sum,
} from "drizzle-orm";
import { FilterType, ImageType } from "../../common/libs/types";
import {
  TCreateFolderDto,
  TDownloadDto,
  TFilterDataDto,
  TUpdateRenameFileDto,
  TUploadFileDto,
} from "./dto";
import { TPaginationDto } from "../../common/dto/paginationDto";

export class FilesRepository {
  private db: MySql2Database;
  constructor(db: MySql2Database) {
    this.db = db;
  }

  // 폴더 생성
  createFolder = async (
    userId: string,
    body: TCreateFolderDto,
  ): ReturnType<(userId: string, body: TCreateFolderDto) => Promise<void>> => {
    await this.db.insert(fileInfo).values({
      fileName: body.fileName,
      extension: "." + ImageType.folder,
      path: body.path,
      imageType: ImageType.folder,
      userId: userId,
    });
  };

  // 파일 업로드
  uploads = async (
    userId: string,
    body: TUploadFileDto,
  ): ReturnType<(userId: string, body: TUploadFileDto) => Promise<void>> => {
    // 파일 정보 생성
    const [info] = await this.db
      .insert(fileInfo)
      .values({
        fileName: body.fileName,
        extension: body.extension,
        path: body.path,
        imageType: body.imageType as ImageType,
        size: BigInt(Buffer.byteLength(body.file)),
        userId: userId,
      })
      .$returningId();

    // 파일 저장
    await this.db.insert(fileContent).values({
      id: info?.id as string,
      buffer: body.file,
    });
  };

  // 여러 파일 조회
  getFiles = async (
    ids: string[],
  ): ReturnType<
    (ids: TDownloadDto) => Promise<
      {
        buffer: string;
      }[]
    >
  > => {
    return await this.db
      .select({
        buffer: fileContent.buffer,
      })
      .from(fileContent)
      .where(inArray(fileContent.id, ids));
  };

  // 선택 파일 조회
  getFile = async (
    id: string,
  ): ReturnType<
    (id: string) => Promise<
      | {
          buffer: string;
        }
      | undefined
    >
  > => {
    const [data] = await this.db
      .select({
        buffer: fileContent.buffer,
      })
      .from(fileContent)
      .where(eq(fileContent.id, id))
      .limit(1);
    return data;
  };

  // 폴더 (총 용량, 파일 갯수) 조회
  getFolderInfos = async (
    fileName: string,
    path: string,
  ): ReturnType<
    (
      fileName: string,
      path: string,
    ) => Promise<{ count: number; totalSize: string | null } | undefined>
  > => {
    const [info] = await this.db
      .select({
        count: count(fileInfo.id),
        totalSize: sum(fileInfo.size),
      })
      .from(fileInfo)
      .where(eq(fileInfo.path, path + fileName));
    return info;
  };

  // 업로드 된 데이터 조회
  getDatas = async (
    userId: string,
    pagination: TPaginationDto,
    query: TFilterDataDto,
  ): ReturnType<
    (
      userId: string,
      pagination: TPaginationDto,
      query: TFilterDataDto,
    ) => Promise<
      {
        id: string;
        fileName: string;
        extension: string;
        path: string;
        imageType: string;
        size: bigint | null;
        updatedAt: Date;
      }[]
    >
  > => {
    const where: Record<string, string> = {};
    if (query.filter === FilterType.images) {
      where["imageType"] = ImageType.image;
    } else if (query.filter === FilterType.documents) {
      where["imageType"] = ImageType.document;
    } else if (query.filter === FilterType.videos) {
      where["imageType"] = ImageType.video;
    }
    if (query.filter === FilterType.recent) {
      // 최근 파일 내역 조회
      const now = new Date();
      // 30일 전
      const beforeDate = new Date(
        new Date(now.setMonth(now.getMonth() - 1)).setHours(0, 0, 0, 0),
      );
      // 하루 뒤 날짜
      const afterDate = new Date(
        new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          now.getDate() + 2,
        ).setHours(0, 0, 0, 0),
      );

      return await this.db
        .select({
          id: fileInfo.id,
          fileName: fileInfo.fileName,
          extension: fileInfo.extension,
          path: fileInfo.path,
          imageType: fileInfo.imageType,
          size: fileInfo.size,
          updatedAt: fileInfo.updatedAt,
        })
        .from(fileInfo)
        .offset((Number(pagination.page) - 1) * Number(pagination.pages))
        .limit(pagination.pages as number)
        .orderBy(
          query.orderBy === "NEW"
            ? desc(fileInfo.updatedAt)
            : asc(fileInfo.updatedAt),
        )
        .where(
          and(
            eq(fileInfo.userId, userId),
            query.search
              ? like(fileInfo.fileName, `${query.search}%`)
              : undefined,
            // 현재 날짜 기준 한달 전 부터, 현재 달 까지 최근 파일 이력 조회
            gte(fileInfo.updatedAt, beforeDate),
            lte(fileInfo.updatedAt, afterDate),
          ),
        );
    }
    console.log("where: ", where);
    return await this.db
      .select({
        id: fileInfo.id,
        fileName: fileInfo.fileName,
        extension: fileInfo.extension,
        path: fileInfo.path,
        imageType: fileInfo.imageType,
        size: fileInfo.size,
        updatedAt: fileInfo.updatedAt,
      })
      .from(fileInfo)
      .offset((Number(pagination.page) - 1) * Number(pagination.pages))
      .limit(pagination.pages as number)
      .orderBy(
        query.orderBy === "NEW"
          ? desc(fileInfo.updatedAt)
          : asc(fileInfo.updatedAt),
      )
      .where(
        and(
          eq(fileInfo.userId, userId),
          query.filter
            ? eq(fileInfo.imageType, where.imageType as ImageType)
            : undefined,
          query.search
            ? like(fileInfo.fileName, `${query.search}%`)
            : undefined,
          query.path ? eq(fileInfo.path, query.path) : undefined,
        ),
      );
  };

  // 파일명 수정
  updateRenameFile = async (
    userId: string,
    id: string,
    body: TUpdateRenameFileDto,
  ): ReturnType<
    (userId: string, id: string, body: TUpdateRenameFileDto) => Promise<void>
  > => {
    await this.db
      .update(fileInfo)
      .set({
        fileName: body.fileName,
      })
      .where(and(eq(fileInfo.userId, userId), eq(fileInfo.id, id)));
  };

  // 파일 삭제
  deleteFile = async (
    userId: string,
    id: string,
  ): ReturnType<(userId: string, id: string) => Promise<void>> => {
    // 파일 정보 삭제
    await this.db
      .delete(fileInfo)
      .where(and(eq(fileInfo.userId, userId), eq(fileInfo.id, id)));

    // 파일 삭제
    await this.db.delete(fileContent).where(eq(fileContent.id, id));
  };
}
