import { Autocomplete, type AutocompleteProps, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { placeEndpoints } from "@/store/constants/places";

type TCityAutocompleteProps<
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
  FreeSolo extends boolean = false,
> = Omit<
  AutocompleteProps<string, Multiple, DisableClearable, FreeSolo>,
  "options" | "renderInput"
>;

const CityAutocomplete = <
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
  FreeSolo extends boolean = false,
>(
  props: TCityAutocompleteProps<Multiple, DisableClearable, FreeSolo>,
) => {
  /** Values */

  const cityListQuery = useQuery({
    queryKey: placeEndpoints.cities().id,
    queryFn: () => placeEndpoints.cities().get(),
  });

  return (
    <Autocomplete
      options={cityListQuery.data ?? []}
      loading={cityListQuery.isLoading}
      renderInput={(params) => (
        <TextField {...params} label="City" placeholder="Select city..." />
      )}
      {...props}
    />
  );
};

export default CityAutocomplete;
