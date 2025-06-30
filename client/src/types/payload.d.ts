interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  photoURL?: string;
}

interface CreateEventPayload {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  id?:string
}
