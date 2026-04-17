import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import GoogleAutocompleteSuggestionAutocomplete from ".";
import { placeEndpoints } from "@/store/constants/places";
import { errorUtils } from "@/store/utils/error";
import type { IGoogleAutocompleteSuggestionAutocompleteProps } from ".";
import type {
  TGoogleAutocompleteSuggestion,
  TGooglePlace,
} from "@/store/types/places";

type TGoogleAutocompleteSuggestionId =
  TGoogleAutocompleteSuggestion["google_place_id"];

type TValue<TMultiple extends boolean | undefined> = TMultiple extends true
  ? TGoogleAutocompleteSuggestionId[]
  : TGoogleAutocompleteSuggestionId | null;

interface IGoogleAutocompleteSuggestionIdAutocompleteProps<
  TMultiple extends boolean | undefined,
  TDisableClearable extends boolean | undefined,
> extends Omit<
  IGoogleAutocompleteSuggestionAutocompleteProps<TMultiple, TDisableClearable>,
  "value" | "onChange"
> {
  value: TValue<TMultiple>;
  onChange?: (value: TValue<TMultiple>) => void;
}

const GoogleAutocompleteSuggestionIdAutocomplete = <
  TMultiple extends boolean | undefined = false,
  TDisableClearable extends boolean | undefined = false,
>({
  multiple,
  value,
  error,
  helperText,
  onChange,
  ...props
}: IGoogleAutocompleteSuggestionIdAutocompleteProps<
  TMultiple,
  TDisableClearable
>) => {
  /** Values */

  const googlePlaceIds = useMemo(
    () =>
      (Array.isArray(value)
        ? value
        : value !== null && value !== undefined && value !== ""
          ? [value]
          : []) as TGoogleAutocompleteSuggestionId[],
    [value],
  );

  /** Queries */

  const googlePlaceQueries = useQueries({
    queries: googlePlaceIds.map((googlePlaceId) => ({
      queryKey: placeEndpoints.googlePlace(googlePlaceId).id,
      queryFn: placeEndpoints.googlePlace(googlePlaceId).get,
    })),
  });

  /** Data */

  const isDetailsLoading = googlePlaceQueries.some(
    (query) => query.isLoading || query.isFetching,
  );
  const googlePlaceDetailsError = googlePlaceQueries.find(
    (query) => query.isError,
  )?.error;

  const placesById = useMemo(
    () =>
      new Map(
        googlePlaceQueries
          .map((query) => query.data)
          .filter((place): place is TGooglePlace => Boolean(place))
          .map((place) => [place.google_place_id, place]),
      ),
    [googlePlaceQueries],
  );

  const mappedValue = useMemo(() => {
    if (multiple)
      return googlePlaceIds
        .map((googlePlaceId) => placesById.get(googlePlaceId))
        .filter((place): place is TGooglePlace => Boolean(place));

    const googlePlaceId = googlePlaceIds[0];
    return googlePlaceId ? (placesById.get(googlePlaceId) ?? null) : null;
  }, [multiple, googlePlaceIds, placesById]);

  return (
    <GoogleAutocompleteSuggestionAutocomplete<TMultiple, TDisableClearable>
      {...props}
      multiple={multiple}
      value={
        mappedValue as IGoogleAutocompleteSuggestionAutocompleteProps<
          TMultiple,
          TDisableClearable
        >["value"]
      }
      loading={isDetailsLoading}
      error={error || Boolean(googlePlaceDetailsError)}
      helperText={
        helperText ||
        (googlePlaceDetailsError &&
          errorUtils.getErrorMessage(googlePlaceDetailsError))
      }
      onChange={(_, selectedValue) => {
        if (!onChange) return;
        if (multiple)
          onChange(
            (selectedValue as TGoogleAutocompleteSuggestion[]).map(
              (place) => place.google_place_id,
            ) as TValue<TMultiple>,
          );
        else
          onChange(
            ((selectedValue as TGoogleAutocompleteSuggestion | null)
              ?.google_place_id ?? null) as TValue<TMultiple>,
          );
      }}
    />
  );
};

export default GoogleAutocompleteSuggestionIdAutocomplete;
