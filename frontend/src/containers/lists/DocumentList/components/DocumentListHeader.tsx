import { type StackProps, Collapse, Stack, Typography } from "@mui/material";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import ListVariantSwitch from "@/components/fields/ListVariantSwitch";
import MenuOptionIconButton from "@/components/buttons/MenuOptionIconButton";
import CloseIconButton from "@/components/buttons/CloseIconButton";
import { EListVariant } from "@/store/enums/layout";
import type { TDocument } from "@/store/types/documents";

export interface IDocumentListHeaderProps extends StackProps {
  search?: string;
  loading?: boolean;
  disabled?: boolean;
  listVariant?: EListVariant;
  options?: IMenuOption[];
  selected?: TDocument[];
  selectedOptions?: IMenuOption[] | ((selected: TDocument[]) => IMenuOption[]);
  onSearchChange?: (search: string) => void;
  onListVariantChange?: (variant: EListVariant) => void;
  onSelectedChange?: (documents: TDocument[]) => void;
}

const DocumentListHeader: React.FC<IDocumentListHeaderProps> = ({
  search,
  loading,
  disabled,
  listVariant = EListVariant.List,
  options,
  selected,
  selectedOptions,
  onSearchChange,
  onListVariantChange,
  onSelectedChange,
  ...props
}) => {
  return (
    <Stack
      py={2}
      borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
      {...props}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        {!!onSearchChange && (
          <DebouncedSearchField
            value={search}
            size="small"
            fullWidth
            loading={!!loading && !!search}
            disabled={disabled}
            onChange={onSearchChange}
          />
        )}
        {!!onListVariantChange && (
          <ListVariantSwitch
            value={listVariant}
            disabled={disabled}
            onChange={(_, v) => onListVariantChange(v)}
          />
        )}
        {!!options?.length && (
          <MenuOptionIconButton options={options} disabled={disabled} />
        )}
      </Stack>
      <Collapse in={!!selected?.length}>
        <Stack direction="row" spacing={1} mt={1} alignItems="center">
          <CloseIconButton onClick={() => onSelectedChange?.([])} />
          <Typography variant="body2" color="text.secondary">
            {selected?.length} selected
          </Typography>
          {!!selectedOptions && (
            <MenuOptionIconButton
              options={
                typeof selectedOptions === "function"
                  ? selectedOptions(selected ?? [])
                  : (selectedOptions ?? [])
              }
              loading={!!loading}
              disabled={disabled}
            />
          )}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default DocumentListHeader;
