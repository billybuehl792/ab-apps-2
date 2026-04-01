import usePlace, { type IUsePlaceOptions } from "@/store/hooks/usePlace";
import Metadata from "@/components/lists/Metadata";
import ListCard, { type IListCardProps } from "@/components/cards/ListCard";
import { PlaceIcons } from "@/store/constants/places";
import type { TPlace } from "@/store/types/places";

type TListCardProps = Omit<IListCardProps, "options" | "onClick" | "onChange">;

interface IPlaceListCardProps
  extends Partial<TListCardProps>, IUsePlaceOptions {
  place: TPlace;
  onClick?: (
    place: TPlace,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

const PlaceListCard: React.FC<IPlaceListCardProps> = ({
  place,
  hideOptions,
  disabled,
  options,
  onClick,
  onChange,
  ...props
}) => {
  /** Values */

  const placeHook = usePlace(place, {
    options,
    disabled,
    hideOptions,
    onChange,
  });

  return (
    <ListCard
      startContent={<PlaceIcons.Detail fontSize="large" color="disabled" />}
      label={place.address_short}
      description={
        <Metadata
          items={[
            {
              id: "city",
              label: "City",
              value: place.city,
            },
          ]}
        />
      }
      link={{
        to: "/app/directory/places/$id",
        params: { id: String(place.id) },
      }}
      disabled={placeHook.disabled}
      options={placeHook.options}
      {...(onClick && { onClick: (event) => onClick(place, event) })}
      {...props}
    />
  );
};

export default PlaceListCard;
