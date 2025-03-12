export interface User {
  userId: number;
  username: string;
  password: string;
  email: string;
  displayName: string;
  avatar: string;
  cover: string;
  about: string;
  role: string;
  privacy: string;
  usersInfoId: number;
}

export interface UserData {
  totalCount: number;
  page: number;
  pageSize: number;
  data: User[];
}