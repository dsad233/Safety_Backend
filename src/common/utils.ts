import { BCRYPT_SALT_ROUNDS } from "./configs/keys";

// mineType enum
export const mineTypes = {
  ".aac": "audio/aac",
  ".abw": "application/x-abiword",
  ".arc": "application/x-freearc",
  ".avif": "image/avif",
  ".avi": "video/x-msvideo",
  ".azw": "application/vnd.amazon.ebook",
  ".bin": "application/octet-stream",
  ".bmp": "image/bmp",
  ".bz": "application/x-bzip",
  ".bz2": "application/x-bzip2",
  ".cda": "application/x-cdf",
  ".csh": "application/x-csh",
  ".css": "text/css",
  ".csv": "text/csv",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".eot": "application/vnd.ms-fontobject",
  ".epub": "application/epub+zip",
  ".gz": "application/gzip",
  ".gif": "image/gif",
  ".htm": "text/html",
  ".html": "text/html",
  ".ico": "image/vnd.microsoft.icon",
  ".ics": "text/calendar",
  ".jar": "application/java-archive",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".jsonld": "application/ld+json",
  ".mid": "audio/midi",
  ".midi": "audio/midi",
  ".mjs": "text/javascript",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".mpeg": "video/mpeg",
  ".mpkg": "application/vnd.apple.installer+xml",
  ".odp": "application/vnd.oasis.opendocument.presentation",
  ".ods": "application/vnd.oasis.opendocument.spreadsheet",
  ".odt": "application/vnd.oasis.opendocument.text",
  ".oga": "audio/ogg",
  ".ogv": "video/ogg",
  ".ogx": "application/ogg",
  ".opus": "audio/opus",
  ".otf": "font/otf",
  ".png": "image/png",
  ".pdf": "application/pdf",
  ".php": "application/x-httpd-php",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".rar": "application/vnd.rar",
  ".rtf": "application/rtf",
  ".sh": "application/x-sh",
  ".svg": "image/svg+xml",
  ".tar": "application/x-tar",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  ".ts": "video/mp2t",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
  ".vsd": "application/vnd.visio",
  ".wav": "audio/wav",
  ".weba": "audio/webm",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xhtml": "application/xhtml+xml",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xml": "application/xml",
  ".xul": "application/vnd.mozilla.xul+xml",
  ".zip": "application/zip",
  ".3gp": "video/3gpp",
  ".3g2": "video/3gpp2",
  ".7z": "application/x-7z-compressed",
} as const;

/**
 * 날짜 가공 함수
 */

// date 가공 함수
export function formatDate(date: Date): string {
  // 현재 시각
  const now = new Date();

  if (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() + 1 === now.getMonth() + 1 &&
    dayDiff(date, now) === 0 &&
    hourDiff(date, now) === 0 &&
    minDiff(date, now) >= 1 &&
    minDiff(date, now) <= 60
  ) {
    return `${minDiff(date, now)}분 전`;
  } else if (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() + 1 === now.getMonth() + 1 &&
    dayDiff(date, now) === 0 &&
    hourDiff(date, now) >= 1 &&
    hourDiff(date, now) <= 24
  ) {
    return `${hourDiff(date, now)}시간 전`;
  } else if (
    date.getFullYear() === now.getFullYear() &&
    dayDiff(date, now) >= 1 &&
    dayDiff(date, now) <= 30
  ) {
    return `${dayDiff(date, now)}일 전`;
  }

  const processedMonth =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const processedDay =
    date.getDate() - 1 < 10 ? "0" + (date.getDate() - 1) : date.getDate() - 1;

  return `${date.getFullYear()}-${processedMonth}-${processedDay}`;
}

// date(일 수) 차이 계산 함수
function dayDiff(startDate: Date, endDate: Date): number {
  const diffDate = startDate.getTime() - endDate.getTime();
  return Math.floor(Math.abs(diffDate / (1000 * 60 * 60 * 24)));
}

// hour(시간) 계산 함수
function hourDiff(startDate: Date, endDate: Date): number {
  const diffDate = startDate.getTime() - endDate.getTime();
  return Math.floor(diffDate / (60 * 60 * 1000));
}

// min(분) 계산 함수
function minDiff(startDate: Date, endDate: Date): number {
  const diffDate = startDate.getTime() - endDate.getTime();
  return Math.floor(diffDate / (60 * 1000));
}

/**
 * Bcrypt 관련 유틸 함수
 */

// 비밀번호 해싱 함수
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcrypt");
  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

// 비밀번호 복호화 함수
export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  const bcrypt = await import("bcrypt");
  return await bcrypt.compare(password, hashedPassword);
}

// 정규식 객체
export const Regex = {
  email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,29}$/,
};
