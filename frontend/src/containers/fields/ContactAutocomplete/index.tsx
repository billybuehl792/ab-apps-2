import { type SyntheticEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import {
  Autocomplete,
  type AutocompleteProps,
  type AutocompleteValue,
  CircularProgress,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  type TextFieldProps,
  Tooltip,
} from "@mui/material";
import { Add, Error } from "@mui/icons-material";
import ContactCreateFormDrawer, {
  type IContactCreateFormDrawerProps,
} from "@/containers/modals/ContactCreateFormDrawer";
import { contactListRequestSchema } from "@/store/schemas/contacts";
import { contactEndpoints, ContactIcons } from "@/store/constants/contacts";
import { errorUtils } from "@/store/utils/error";
import { useSnackbar } from "notistack";
import { markdownUtils } from "@/store/utils/markdown";
import { EObjectChangeType } from "@/store/enums/api";
import type { TContact } from "@/store/types/contacts";

type TContactAutocompleteBaseProps<
  TMultiple extends boolean | undefined,
  TDisableClearable extends boolean | undefined,
> = AutocompleteProps<TContact, TMultiple, TDisableClearable, false>;

export interface IContactAutocompleteProps<
  TMultiple extends boolean | undefined,
  TDisableClearable extends boolean | undefined,
> extends Omit<
  TContactAutocompleteBaseProps<TMultiple, TDisableClearable>,
  | "options"
  | "renderInput"
  | "renderOption"
  | "getOptionLabel"
  | "isOptionEqualToValue"
  | "getOptionKey"
  | "slotProps"
> {
  inputRef?: TextFieldProps["inputRef"];
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  enableCreate?: boolean;
  slotProps?: {
    input?: TextFieldProps;
  } & TContactAutocompleteBaseProps<TMultiple, TDisableClearable>["slotProps"];
}

const ContactAutocomplete = <
  TMultiple extends boolean | undefined = false,
  TDisableClearable extends boolean | undefined = false,
>({
  inputRef,
  value,
  label = "Contact",
  placeholder = "Search for a contact",
  error,
  helperText,
  required,
  multiple,
  enableCreate = false,
  onChange,
  slotProps: { input: inputProps, ...slotProps } = {},
  ...props
}: IContactAutocompleteProps<TMultiple, TDisableClearable>) => {
  /** Values */

  const snackbar = useSnackbar();

  const [search, setSearch] = useDebounce("", 600);
  const [createOpen, setCreateOpen] = useState(false);

  /** Queries */

  const listQuery = useQuery({
    queryKey: [
      contactEndpoints.id,
      contactListRequestSchema.parse({ params: { search } }),
    ] as const,
    queryFn: ({ queryKey }) => contactEndpoints.get(queryKey[1]),
  });

  /** Mutations */

  const createContactMutation = useMutation({
    mutationKey: [contactEndpoints.id, EObjectChangeType.Create],
    mutationFn: contactEndpoints.post,
    onSuccess: (res) =>
      snackbar.enqueueSnackbar(
        `${markdownUtils.bold(`${res.first_name} ${res.last_name}`)} created successfully`,
        { variant: "success" },
      ),
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  /** Data */

  const options = listQuery.data?.results ?? [];
  const optionsError = listQuery.error;
  const isOptionsLoading = listQuery.isLoading;

  /** Callbacks */

  const handleOnCreateSubmit: IContactCreateFormDrawerProps["form"]["onSubmit"] =
    (data, event) =>
      createContactMutation.mutateAsync(
        {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone_primary: data.phonePrimary,
          phone_secondary: data.phoneSecondary,
          google_place_id: data.place?.placePrediction.placeId,
        },
        {
          onSuccess: (res) => {
            const newValue = (
              multiple ? [...(Array.isArray(value) ? value : []), res] : res
            ) as AutocompleteValue<
              TContact,
              TMultiple,
              TDisableClearable,
              false
            >;
            setCreateOpen(false);
            onChange?.(
              event as SyntheticEvent,
              newValue,
              "selectOption",
              undefined,
            );
          },
        },
      );

  return (
    <>
      <Autocomplete
        options={options}
        value={value}
        multiple={multiple}
        loading={isOptionsLoading}
        getOptionKey={(option) => option.id}
        getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
        onInputChange={(_, newInputValue) => setSearch(newInputValue)}
        filterOptions={(options) => options}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField
            label={label}
            inputRef={inputRef}
            placeholder={placeholder}
            required={required}
            error={error}
            helperText={helperText}
            {...inputProps}
            {...params}
            slotProps={{
              ...inputProps?.slotProps,
              input: {
                ...inputProps?.slotProps?.input,
                ...params.InputProps,
                endAdornment: (
                  <Stack direction="row" spacing={1} alignItems="center">
                    {isOptionsLoading && (
                      <CircularProgress color="inherit" size={16} />
                    )}
                    {enableCreate && (
                      <InputAdornment position="end">
                        <Tooltip title="Create new contact">
                          <IconButton
                            onClick={() => setCreateOpen(true)}
                            edge="end"
                          >
                            <Add />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    )}
                    {params.InputProps.endAdornment}
                    {!!optionsError && (
                      <Tooltip title={errorUtils.getErrorMessage(optionsError)}>
                        <Error color="error" />
                      </Tooltip>
                    )}
                  </Stack>
                ),
              },
            }}
          />
        )}
        renderOption={({ key, ...props }, option) => (
          <MenuItem key={key} {...props}>
            <ListItemIcon>
              <ContactIcons.Detail />
            </ListItemIcon>
            <ListItemText
              primary={`${option.first_name} ${option.last_name}`}
              secondary={option.place?.address_short}
            />
          </MenuItem>
        )}
        onChange={onChange}
        slotProps={slotProps}
        {...props}
      />
      {!!enableCreate && (
        <ContactCreateFormDrawer
          form={{
            onSubmit: handleOnCreateSubmit,
            onCancel: () => setCreateOpen(false),
          }}
          open={createOpen}
          onClose={() => setCreateOpen(false)}
        />
      )}
    </>
  );
};

export default ContactAutocomplete;
