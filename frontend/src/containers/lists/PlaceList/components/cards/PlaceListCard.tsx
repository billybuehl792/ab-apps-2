import Metadata from "@/components/lists/Metadata";
import ListCard, { type IListCardProps } from "@/components/cards/ListCard";
import { PlaceIcons } from "@/store/constants/places";
import type { TPlace } from "@/store/types/places";

type TListCardProps = Omit<IListCardProps, "onClick" | "onChange">;

export interface IPlaceListCardProps extends Partial<TListCardProps> {
  place: TPlace;
  onClick?: (
    place: TPlace,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

const PlaceListCard: React.FC<IPlaceListCardProps> = ({
  place,
  onClick,
  ...props
}) => {
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
      link={{ to: "/app/places/$id", params: { id: String(place.id) } }}
      {...(!!onClick && { onClick: (event) => onClick(place, event) })}
      {...props}
    />
  );
};

export default PlaceListCard;
