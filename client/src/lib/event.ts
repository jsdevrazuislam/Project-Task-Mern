import api from "./api";
import ApiStrings from "./api-strings";

export const createEvent = async (
  payload: CreateEventPayload
): Promise<EventCreateResponse> => {
  const response = await api.post<EventCreateResponse>(
    ApiStrings.CREATE_EVENT,
    payload
  );
  return response.data;
};

export const updateEvent = async (
  payload: CreateEventPayload
): Promise<EventCreateResponse> => {
  const response = await api.patch<EventCreateResponse>(
    `${ApiStrings.CREATE_EVENT}${payload.id}`,
    {
      time: payload.time,
      date: payload.date,
      title: payload.title,
      description: payload.description,
      location: payload.location,
    }
  );
  return response.data;
};

export const deleteEvent = async (id:string) => {
  const response = await api.delete(`${ApiStrings.CREATE_EVENT}${id}`);
  return response.data;
};

export const joinEventApi = async (
  id: string
): Promise<EventCreateResponse> => {
  const response = await api.post<EventCreateResponse>(
    `${ApiStrings.CREATE_EVENT}${id}/join`
  );
  return response.data;
};

export const getAllEvents = async ({
  page = 1,
  limit = 20,
  search,
  from,
  to,
}: {
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}): Promise<EventsResponse> => {
  const params: Record<string, any> = {};

  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (search) params.search = search;
  if (from) params.from = from;
  if (to) params.to = to;

  const response = await api.get<EventsResponse>(ApiStrings.CREATE_EVENT, {
    params,
  });
  return response.data;
};

export const getAllMyEvents = async ({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
}): Promise<EventsResponse> => {
  const params: Record<string, any> = {};

  if (page) params.page = page;
  if (limit) params.limit = limit;

  const response = await api.get<EventsResponse>(ApiStrings.MY_EVENTS, {
    params,
  });
  return response.data;
};
