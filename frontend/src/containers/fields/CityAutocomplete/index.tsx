import { useQuery } from "@tanstack/react-query";
import { Autocomplete, type AutocompleteProps, TextField } from "@mui/material";
import { placeQueries } from "@/store/queries/places";

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

  const listQuery = useQuery(placeQueries.cities.list());

  return (
    <Autocomplete
      options={listQuery.data ?? []}
      loading={listQuery.isLoading}
      renderInput={(params) => (
        <TextField {...params} label="City" placeholder="Select city..." />
      )}
      {...props}
    />
  );
};

export default CityAutocomplete;
