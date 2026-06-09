import { useState, type SyntheticEvent, useMemo } from "react";
import {
  Button,
  ButtonGroup,
  Typography,
  Tooltip,
  Stack,
  type ButtonGroupProps,
  type ButtonProps,
} from "@mui/material";
import { ArrowDropDown, ArrowUpward, Sort } from "@mui/icons-material";
import MenuOptionModal, {
  type IMenuOptionModalProps,
} from "@/components/modals/MenuOptionModal";
import { EOrderingDirection } from "@/store/enums/api";

type TTOrderingOptionValue<TOptions extends TOrderingOption[]> =
  | TOptions[number]["value"][EOrderingDirection.ASC]
  | TOptions[number]["value"][EOrderingDirection.DESC];

export interface IOrderingButtonGroupProps<
  TOptions extends TOrderingOption[],
  TAllowEmpty extends boolean | undefined = false,
> extends Omit<ButtonGroupProps, "onChange"> {
  options: TOptions;
  allowEmpty?: TAllowEmpty;
  value: TTOrderingOptionValue<TOptions>;
  onChange: (
    value: TTOrderingOptionValue<TOptions>,
    event: SyntheticEvent,
  ) => void;
  onDirectionChange?: (
    direction: EOrderingDirection,
    event: SyntheticEvent,
  ) => void;
}

const OrderingButtonGroup = <
  TOptions extends TOrderingOption[],
  TAllowEmpty extends boolean | undefined = false,
>({
  value: valueProp,
  options: optionsProp,
  allowEmpty,
  onChange,
  onDirectionChange,
  ...props
}: IOrderingButtonGroupProps<TOptions, TAllowEmpty>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  /** Values */

  const modalOpen = Boolean(anchorEl);

  const [selectedOption, direction] = useMemo(() => {
    if (valueProp === null) return [null, null];
    for (const option of optionsProp) {
      if (option.value[EOrderingDirection.ASC] === valueProp)
        return [option, EOrderingDirection.ASC];
      if (option.value[EOrderingDirection.DESC] === valueProp)
        return [option, EOrderingDirection.DESC];
    }
    return [null, null];
  }, [valueProp, optionsProp]);

  const label = selectedOption ? selectedOption.label : "Ordering";
  const isAscending = direction === EOrderingDirection.ASC;

  const options = useMemo(
    () =>
      optionsProp.map((o) => ({ selected: o.id === selectedOption?.id, ...o })),
    [selectedOption, optionsProp],
  ) as TOptions;

  /** Callbacks */

  const handleToggleModalOpen: ButtonProps["onClick"] = (event) =>
    setAnchorEl((current) => (current ? null : event.currentTarget));

  const handleCloseModal = () => setAnchorEl(null);

  const handleOnOptionSelect: IMenuOptionModalProps<TOptions>["onSelect"] = (
    option,
    event,
  ) => {
    onChange(option.value[direction ?? EOrderingDirection.ASC], event);
    handleCloseModal();
  };

  const handleOnDirectionChange: ButtonProps["onClick"] = (event) => {
    if (!selectedOption) return;
    const newDirection = isAscending
      ? EOrderingDirection.DESC
      : EOrderingDirection.ASC;
    const newValue = selectedOption.value[newDirection];
    onChange(newValue, event);
    onDirectionChange?.(newDirection, event);
  };

  return (
    <>
      <ButtonGroup {...props}>
        <Button
          endIcon={
            <ArrowDropDown
              sx={{
                transform: `rotate(${modalOpen ? -180 : 0}deg)`,
                transition: (t) => t.transitions.create("transform"),
              }}
            />
          }
          onClick={handleToggleModalOpen}
          sx={{ flexGrow: 1 }}
        >
          <Tooltip title={`Order by: ${label}`}>
            <Typography
              component="span"
              variant="body2"
              maxWidth={120}
              flexGrow={1}
              noWrap
            >
              {label}
            </Typography>
          </Tooltip>
        </Button>
        <Button
          disabled={!selectedOption}
          onClick={handleOnDirectionChange}
          sx={{ px: 0.5 }}
        >
          <Tooltip
            title={`Direction: ${isAscending ? "Ascending" : "Descending"}`}
          >
            <Stack direction="row" alignItems="center">
              <ArrowUpward
                fontSize="xxs"
                sx={{
                  transform: `rotate(${isAscending ? -180 : 0}deg)`,
                  transition: (t) => t.transitions.create("transform"),
                }}
              />
              <Sort fontSize="small" />
            </Stack>
          </Tooltip>
        </Button>
      </ButtonGroup>

      {/* Modals */}
      <MenuOptionModal
        open={modalOpen}
        anchorEl={anchorEl}
        options={options}
        onSelect={handleOnOptionSelect}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default OrderingButtonGroup;
