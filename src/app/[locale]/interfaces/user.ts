export interface User {
  userId: number;
  username: string;
  password: string;
  email: string;
  displayName: string;
  avatar: string;
  cover: string;
  about: string;
  role?: UserRole | string;
  privacy: string;
  usersInfoId: number;
}

export interface UserData {
  totalCount: number;
  page: number;
  pageSize: number;
  data: User[];
}

export interface UserLoginData {
  id: number;
  displayName: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
  jwtToken: string;
}

export interface LoginStatus {
  loginStatId?: number;
  attempts: number;
  status: string;
  dateLock?: Date | string;
  dateLockTimestamp?: number;
  type?: UserSessionsTypes;
  modeTimer?: UserSessionsTypesTimes;
  valueTimer?: Date;
  userId?: number;
}

export enum UserSessionsTypes {
  Permanent = "permanent",
  Temporary = "temporary"
}

export enum UserSessionsTypesTimes {
  Week = "week",
  Month = "month",
  Custom = "custom",
  None = "none"
}

export type UserRole = "admin" | "dev" | "user" | "moderator" | "member" | "guest" | "editor" | "vip" | "banned" | null;
