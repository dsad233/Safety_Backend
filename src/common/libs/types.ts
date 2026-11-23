/**
 * File 관련 enum
 */
export enum ImageType {
  image = "image",
  document = "document",
  video = "video",
  other = "other",
  folder = "folder",
}

export enum OrderByType {
  NEW = "NEW",
  OLD = "OLD",
}

export enum FilterType {
  all = "all",
  recent = "recent",
  images = "images",
  documents = "documents",
  videos = "videos",
}

/**
 * Auth 관련 enum
 */
export enum TokenType {
  ACCESS = "ACCESS",
  REFRESH = "REFRESH",
}

/**
 * Prefix 관련 enum
 */

export enum PrefixType {
  SESSION = "SESSION",
  CACHED = "CACHED",
}

export enum DomainPrefixType {
  AUTH = "AUTH",
  FILES = "FILES",
  USERS = "USERS",
}
