import api from "../config/api";
import { placeEndpoints } from "../constants/places";
import type { ApiListResponse } from "../types/api";
import type { Place, PlaceApiListRequest } from "../types/places";

const list = (params?: PlaceApiListRequest) =>
  api.get<ApiListResponse<Place>>(placeEndpoints.places(), { params });

const detail = (id: Place["id"]) =>
  api.get<Place>(placeEndpoints.places.detail(id));

const create = (body: Omit<Place, "id">) =>
  api.post<Place>(placeEndpoints.places(), body);

const update = (body: Pick<Place, "id"> & Partial<Omit<Place, "id">>) =>
  api.patch<Place>(placeEndpoints.places.detail(body.id), body);

const _delete = (body: Place["id"]) =>
  api.delete(placeEndpoints.places.detail(body));

/** Other */

const cities = () => api.get<string[]>(placeEndpoints.places.cities());

/** Google */

const googlePlace = (id: string, sessionToken?: string) =>
  api.get<Place>(placeEndpoints.places.googlePlace(), {
    params: { id, sessionToken },
  });

const googleAutocompleteSuggestions = (input: string, sessionToken?: string) =>
  api.get<Place[]>(placeEndpoints.places.googleAutocompleteSuggestions(), {
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
  googleAutocompleteSuggestions,
};
