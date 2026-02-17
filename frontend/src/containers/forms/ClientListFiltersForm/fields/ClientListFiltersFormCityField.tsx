import { useQuery } from "@tanstack/react-query";
import {
  Autocomplete,
  type AutocompleteProps,
  Chip,
  CircularProgress,
  TextField,
} from "@mui/material";
import { placeQueries } from "@/store/queries/places";

const ClientListFiltersFormCityField: React.FC<
  Omit<
    AutocompleteProps<string, true, false, false>,
    "options" | "renderInput" | "renderValue"
  >
> = (props) => {
  /** Queries */

  const citiesQuery = useQuery(placeQueries.cities());

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={citiesQuery.data ?? []}
      loading={citiesQuery.isLoading}
      getOptionKey={(option) => option}
      getOptionLabel={(option) => option}
      includeInputInList
      isOptionEqualToValue={(option, value) => option === value}
      renderInput={(params) => (
        <TextField
          label="City"
          {...params}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {citiesQuery.isLoading && (
                    <CircularProgress color="inherit" size={20} />
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      renderValue={(value, getItemProps) =>
        value.map((item, index) => {
          const { key, ...itemProps } = getItemProps({ index });
          return <Chip key={key} label={item} size="small" {...itemProps} />;
        })
      }
      {...props}
    />
  );
};

export default ClientListFiltersFormCityField;
