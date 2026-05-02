import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import GoogleAutocompleteSuggestionAutocomplete from ".";
import { placeEndpoints } from "@/store/constants/places";
import { errorUtils } from "@/store/utils/error";
import type { IGoogleAutocompleteSuggestionAutocompleteProps } from ".";
import type { TGoogleAutocompleteSuggestion } from "@/store/types/places";

type TValue<TMultiple extends boolean | undefined> = TMultiple extends true
  ? string[]
  : string | null;

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
          : []) as string[],
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

  const placesById: Map<string, TGoogleAutocompleteSuggestion> = useMemo(
    () =>
      new Map(
        googlePlaceQueries
          .filter((query) => query.isSuccess)
          .map((query) => [
            query.data.id,
            {
              placePrediction: {
                placeId: query.data.id,
                text: { text: query.data.formattedAddress },
              },
            },
          ]),
      ),
    [googlePlaceQueries],
  );

  const mappedValue = useMemo(() => {
    if (multiple)
      return googlePlaceIds.map((googlePlaceId) =>
        placesById.get(googlePlaceId),
      );

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
              (value) => value.placePrediction.placeId,
            ) as TValue<TMultiple>,
          );
        else
          onChange(
            ((selectedValue as TGoogleAutocompleteSuggestion | null)
              ?.placePrediction.placeId ?? null) as TValue<TMultiple>,
          );
      }}
    />
  );
};

export default GoogleAutocompleteSuggestionIdAutocomplete;
