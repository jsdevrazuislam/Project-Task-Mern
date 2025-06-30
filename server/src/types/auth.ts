export interface User {
  name: string;
  email: string;
  password: string;
  photoURL?: string;
  _id: string;
}
export interface JwtResponse {
  email: string;
  _id: string;
  name: string;
}
