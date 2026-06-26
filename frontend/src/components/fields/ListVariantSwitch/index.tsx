import { Box, Switch, type SwitchProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";

const StyledSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    color: theme.palette.primary.contrastText,
    ...theme.applyStyles("dark", {
      color: theme.palette.primary.dark,
    }),
    "&.Mui-checked": {
      color: theme.palette.primary.contrastText,
      transform: "translateX(22px)",
      ...theme.applyStyles("dark", {
        color: theme.palette.primary.dark,
      }),
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.grey[400],
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.primary.dark,
    width: 32,
    height: 32,
    borderRadius: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.primary.contrastText,
    }),
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.grey[400],
    borderRadius: 20 / 2,
  },
}));

const ListVariantSwitch: React.FC<SwitchProps> = (props) => (
  <StyledSwitch
    icon={
      <Box component="span" className="MuiSwitch-thumb">
        <ViewListIcon sx={{ fontSize: 18 }} />
      </Box>
    }
    checkedIcon={
      <Box component="span" className="MuiSwitch-thumb">
        <GridViewIcon sx={{ fontSize: 18 }} />
      </Box>
    }
    {...props}
  />
);

export default ListVariantSwitch;
