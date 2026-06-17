import { Chip, type ChipProps } from "@mui/material";
import usePlace from "@/store/hooks/usePlace";
import { PlaceIcons } from "@/store/constants/places";
import type { IUsePlaceOptions, TUsePlace } from "@/store/hooks/usePlace";
import type { TPlaceBasic } from "@/store/types/places";

interface IPlaceChipProps extends Omit<ChipProps, "onClick"> {
  place: TPlaceBasic;
  options?: IUsePlaceOptions;
  onClick?: (placeHook: TUsePlace) => void;
}

const PlaceChip = ({ place, options, onClick, ...props }: IPlaceChipProps) => {
  /** Values */

  const placeHook = usePlace(place, options);

  return (
    <Chip
      icon={<PlaceIcons.Detail fontSize={props.size} />}
      label={place.address_short}
      {...(props?.clickable !== false
        ? {
            onClick: !!onClick
              ? () => onClick(placeHook)
              : () => placeHook.view(),
          }
        : {})}
      {...props}
    />
  );
};

export default PlaceChip;
