import React from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  type MarkerProps,
  type MapProps,
} from "@vis.gl/react-google-maps";
import { Card, Stack, type StackProps } from "@mui/material";
import type { TPlace } from "@/store/types/places";

interface IPlaceDetailCardProps extends StackProps<typeof Card> {
  place: TPlace;
  slotProps?: {
    content?: StackProps;
    map?: Partial<MapProps>;
    marker?: Partial<MarkerProps>;
  };
}

const PlaceDetailCard: React.FC<IPlaceDetailCardProps> = ({
  place,
  slotProps,
  ...props
}) => {
  /** Values */

  const position: MarkerProps["position"] = {
    lat: place.latitude,
    lng: place.longitude,
  };

  return (
    <Stack
      component={Card}
      position="relative"
      width={300}
      height={300}
      {...props}
    >
      <Stack width="100%" height="100%">
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <Map
            mapId={place.google_place_id}
            defaultCenter={position}
            defaultZoom={15}
            {...slotProps?.map}
          >
            <AdvancedMarker position={position} />
          </Map>
        </APIProvider>
      </Stack>
    </Stack>
  );
};

export default PlaceDetailCard;
