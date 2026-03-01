export interface LoginDto {
  email?: string;
  username?: string;
  password?: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password?: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
}
