import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  CircularProgress,
  InputAdornment,
  Stack,
  type StandardTextFieldProps,
  TextField,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import CloseIconButton from "@/components/buttons/CloseIconButton";

interface DebouncedSearchFieldProps
  extends Omit<StandardTextFieldProps, "onChange" | "value"> {
  value: string | undefined;
  loading?: boolean;
  onSearch: (term: string) => void;
}

const DebouncedSearchField = ({
  value,
  loading,
  onSearch,
  ...props
}: DebouncedSearchFieldProps) => {
  const [localValue, setLocalValue] = useState(value ?? "");

  /** Callbacks */

  const handleOnChange = (term: string) => {
    setLocalValue(term);
    handleDebouncedSearch(term);
  };

  const handleOnClear = () => handleOnChange("");

  const handleDebouncedSearch = useDebouncedCallback(
    (term: string) => onSearch(term),
    500
  );

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  return (
    <TextField
      type="search"
      inputMode="search"
      autoComplete="off"
      fullWidth
      value={localValue}
      onChange={(event) => handleOnChange(event.target.value)}
      {...props}
      slotProps={{
        ...props.slotProps,
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment
              component={Stack}
              direction="row"
              spacing={1}
              position="end"
            >
              {loading ? (
                <CircularProgress color="inherit" size={props.size} />
              ) : null}
              {!!localValue && (
                <CloseIconButton size="small" onClick={handleOnClear} />
              )}
            </InputAdornment>
          ),
          ...props.slotProps?.input,
        },
      }}
    />
  );
};

export default DebouncedSearchField;
