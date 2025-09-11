import { Paper, type PaperProps } from "@mui/material";
import NavList from "@/containers/lists/NavList";
import { sxUtils } from "@/store/utils/sx";

interface NavPanelProps extends PaperProps {
  width: number;
  top: number;
  left: number;
  bottom: number;
}

const NavPanel = ({
  width,
  top,
  left,
  bottom,
  sx,
  ...props
}: NavPanelProps) => {
  return (
    <Paper
      component="nav"
      variant="outlined"
      square
      sx={[
        {
          position: "fixed",
          top,
          bottom,
          left,
          width,
          overflowY: "auto",
          zIndex: ({ zIndex }) => zIndex.drawer,
        },
        ...sxUtils.asArray(sx),
      ]}
      {...props}
    >
      <NavList />
    </Paper>
  );
};

export default NavPanel;
