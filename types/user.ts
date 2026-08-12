export interface User {
  email: string;
  username: string;
  avatar: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
}

export interface UpdateMeInput {
  username?: string;
  avatar?: string;
}
