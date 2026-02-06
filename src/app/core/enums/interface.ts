
export interface LoginResponse {
  email: string;
  userfname: string;
  userlname: string;
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  passwordConfirmation: string;
  firstName: string;
  lastName: string;
}