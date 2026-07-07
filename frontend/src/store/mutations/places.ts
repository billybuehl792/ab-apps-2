import { mutationOptions } from "@tanstack/react-query";
import { placeEndpoints } from "../endpoints/places";
import type { TPlace } from "../types/places";

export const placeMutations = {
  delete: mutationOptions({
    mutationKey: ["places", "place", "delete"] as const,
    mutationFn: (id: TPlace["id"]) => placeEndpoints.place(id).delete(),
  }),
  place: (id: TPlace["id"]) => ({
    delete: mutationOptions({
      mutationKey: ["places", "place", "delete", id] as const,
      mutationFn: placeEndpoints.place(id).delete,
    }),
  }),
};
