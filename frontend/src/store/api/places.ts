import api from "../config/api";
import endpoints from "../constants/endpoints";
import type { ApiListResponse } from "../types/api";
import type { Place, PlaceApiListRequest } from "../types/places";

const list = (params?: PlaceApiListRequest) =>
  api.get<ApiListResponse<Place>>(endpoints.places(), { params });

const detail = (id: Place["id"]) => api.get<Place>(endpoints.places.detail(id));

const create = (body: Omit<Place, "id">) =>
  api.post<Place>(endpoints.places(), body);

const update = (body: Pick<Place, "id"> & Partial<Omit<Place, "id">>) =>
  api.patch<Place>(endpoints.places.detail(body.id), body);

const _delete = (body: Place["id"]) =>
  api.delete(endpoints.places.detail(body));

/** Other */

const cities = () => api.get<string[]>(endpoints.places.cities());

/** Google */

const googlePlace = (id: string, sessionToken?: string) =>
  api.get<Place>(endpoints.places.googlePlace(), {
    params: { id, sessionToken },
  });

const googleSuggestions = (input: string, sessionToken?: string) =>
  api.get<Place[]>(endpoints.places.googleSuggestions(), {
    params: { input, sessionToken },
  });

export const placeApi = {
  list,
  detail,
  create,
  update,
  delete: _delete,
  // Other
  cities,
  // Google
  googlePlace,
  googleSuggestions,
};
