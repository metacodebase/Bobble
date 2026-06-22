export interface AuthUser {
  _id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}
