import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useBlocker } from "@tanstack/react-router";
import {
  Button,
  type ButtonProps,
  Stack,
  type StackProps,
  FormHelperText,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import usePlace from "@/store/hooks/usePlace";
import useConfirm from "@/store/hooks/useConfirm";
import GoogleAutocompleteSuggestionIdAutocomplete from "@/containers/fields/GoogleAutocompleteSuggestionAutocomplete/GoogleAutocompleteSuggestionIdAutocomplete";
import { placeCreateSchema } from "@/store/schemas/places";
import { errorUtils } from "@/store/utils/error";
import { NULL_ID } from "@/store/constants/api";
import type { TPlace, TPlaceCreate } from "@/store/types/places";

interface IPlaceCreateFormProps extends Omit<
  StackProps<"form">,
  "component" | "onSubmit" | "onReset"
> {
  initialValues?: Partial<TPlaceCreate>;
  onSuccess: (place: TPlace) => void;
  onCancel: ButtonProps["onClick"];
  slotProps?: {
    fields?: StackProps;
    actions?: StackProps;
    submitButton?: ButtonProps;
    cancelButton?: ButtonProps;
  };
}

const DEFAULT_VALUES: TPlaceCreate = {
  google_place_id: "",
};

const PlaceCreateForm: React.FC<IPlaceCreateFormProps> = ({
  initialValues,
  onSuccess,
  onCancel,
  slotProps,
  ...props
}) => {
  /** Values */

  const confirm = useConfirm();
  const placeHook = usePlace(NULL_ID);
  const methods = useForm({
    resolver: zodResolver(placeCreateSchema),
    defaultValues: DEFAULT_VALUES,
  });

  /** Mutations */

  const createPlaceMutation = placeHook.mutations.create;

  /** Data */

  const isDirty = methods.formState.isDirty;
  const isSubmitting = createPlaceMutation.isPending;
  const isDisabled = methods.formState.disabled;
  const isFieldDisabled = isDisabled || isSubmitting;

  /** Callbacks */

  const handleOnSubmit = methods.handleSubmit((data) => {
    createPlaceMutation.mutate(data, {
      onSuccess,
      onError: (error) => {
        methods.setError("root", {
          type: "server",
          message: errorUtils.getErrorMessage(error),
        });
      },
    });
  });

  /** Effects */

  useEffect(() => {
    methods.reset({ ...DEFAULT_VALUES, ...initialValues });
  }, [initialValues]);

  useBlocker({
    shouldBlockFn: async () => {
      return isDirty
        ? !(await confirm({
            title: "Unsaved Changes",
            description:
              "You have unsaved changes. Are you sure you want to leave?",
            confirmButton: { color: "error", children: "Leave" },
            cancelButton: { color: "primary", children: "Cancel" },
          }))
        : false;
    },
  });

  return (
    <Stack
      component="form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        handleOnSubmit(e);
      }}
      onReset={(e) => e.preventDefault()}
      {...props}
    >
      <Stack spacing={2} mb={2} {...slotProps?.fields}>
        {!!methods.formState.errors.root && (
          <FormHelperText error>
            {methods.formState.errors.root?.message}
          </FormHelperText>
        )}
        <Controller
          name="google_place_id"
          control={methods.control}
          render={({ field, formState }) => (
            <GoogleAutocompleteSuggestionIdAutocomplete
              label="Address"
              disabled={isFieldDisabled}
              error={!!formState.errors.google_place_id}
              helperText={formState.errors.google_place_id?.message}
              {...field}
            />
          )}
        />
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="end"
        {...slotProps?.actions}
      >
        <Button
          variant="text"
          color="error"
          disabled={isDisabled}
          children="Cancel"
          onClick={onCancel}
          {...slotProps?.cancelButton}
        />
        <Button
          type="submit"
          disabled={isDisabled}
          loading={isSubmitting}
          children="Submit"
          {...slotProps?.submitButton}
        />
      </Stack>
    </Stack>
  );
};

export default PlaceCreateForm;
