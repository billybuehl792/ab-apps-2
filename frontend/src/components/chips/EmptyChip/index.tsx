import React from "react";
import { Chip, type ChipProps } from "@mui/material";
import { sxUtils } from "@/store/utils/sx";

const EmptyChip: React.FC<ChipProps> = ({ sx, ...props }) => {
  return (
    <Chip
      label="None"
      color="disabled"
      {...props}
      sx={[{ fontStyle: "italic" }, ...sxUtils.asArray(sx)]}
    />
  );
};

export default EmptyChip;
