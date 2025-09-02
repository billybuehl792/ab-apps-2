import { type FormEventHandler, useEffect, useState } from "react";
import {
  CircularProgress,
  InputAdornment,
  Stack,
  StackProps,
  type StandardTextFieldProps,
  TextField,
} from "@mui/material";
import CloseIconButton from "@/components/buttons/CloseIconButton";
import SearchIconButton from "@/components/buttons/SearchIconButton";

interface SearchFieldProps
  extends Omit<StandardTextFieldProps, "onChange" | "value" | "slotProps"> {
  value: string | undefined;
  loading?: boolean;
  onSearch: (term: string) => void;
  slotProps?: {
    root?: StackProps<"form">;
  } & StandardTextFieldProps["slotProps"];
}

const SearchField = ({
  value,
  loading,
  onSearch,
  slotProps: { root, ...slotProps } = {},
  ...props
}: SearchFieldProps) => {
  const [localValue, setLocalValue] = useState(value ?? "");

  /** Callbacks */

  const handleOnChange: StandardTextFieldProps["onChange"] = (event) => {
    setLocalValue(event.target.value);
  };

  const handleOnSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    onSearch(localValue);
  };

  const handleOnReset: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setLocalValue("");
    onSearch("");
  };

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  return (
    <Stack
      component="form"
      direction="row"
      alignItems="center"
      spacing={1}
      flexGrow={1}
      onSubmit={handleOnSubmit}
      onReset={handleOnReset}
      {...root}
    >
      <TextField
        type="search"
        inputMode="search"
        autoComplete="off"
        fullWidth
        value={localValue}
        onChange={handleOnChange}
        {...props}
        slotProps={{
          ...slotProps,
          input: {
            endAdornment: (
              <InputAdornment
                component={Stack}
                direction="row"
                spacing={1}
                position="end"
              >
                {loading && (
                  <CircularProgress color="inherit" size={props.size} />
                )}
                {!!localValue && <CloseIconButton type="reset" size="small" />}
              </InputAdornment>
            ),
            ...slotProps?.input,
          },
        }}
      />
      <SearchIconButton type="submit" />
    </Stack>
  );
};

export default SearchField;
