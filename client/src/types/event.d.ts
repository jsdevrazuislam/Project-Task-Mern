interface EventsResponse {
  statusCode: number;
  data: EventsData;
  message: string;
  success: boolean;
}
interface EventCreateResponse {
  statusCode: number;
  data: EventsEntity;
  message: string;
  success: boolean;
}
interface EventsData {
  total: number;
  page: number;
  limit: number;
  events?: EventsEntity[] | null;
}
interface EventsEntity {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attendeeCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  createdBy: {
    _id:string
    name:string
  }
  joinedUsers: string[]
}
