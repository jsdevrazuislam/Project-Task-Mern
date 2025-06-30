
 interface LoginResponse {
  statusCode: number;
  data: LoginData;
  message: string;
  success: boolean;
}

interface AuthResponse{
  statusCode: number;
  data: User;
  message: string;
  success: boolean;
}

 interface Data {
  user: User;
  token: string;
}
 interface User {
  name: string;
  email: string;
  password: string;
  photoURL: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
