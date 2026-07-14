import { sxUtils } from "@/store/utils/sx";
import {
  Avatar,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  IconButton,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import { Delete, InsertDriveFile } from "@mui/icons-material";

export interface IFileCardProps extends Omit<CardProps, "value" | "onClick"> {
  value: File;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: File,
  ) => void;
  onDelete?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: File,
  ) => void;
}

const FileCard: React.FC<IFileCardProps> = ({
  value,
  onClick,
  onDelete,
  ...props
}) => {
  /** Callbacks */

  const renderContent = () => (
    <CardContent
      component={Stack}
      direction="row"
      alignItems="center"
      spacing={1}
    >
      <Avatar
        variant="rounded"
        src={URL.createObjectURL(value)}
        sx={{ width: 56, height: 56 }}
      >
        <InsertDriveFile />
      </Avatar>
      <Typography variant="body2" noWrap>
        {value.name}
      </Typography>
    </CardContent>
  );

  return (
    <Card
      {...props}
      sx={[{ position: "relative" }, ...sxUtils.asArray(props.sx)]}
    >
      {onClick ? (
        <CardActionArea onClick={(e) => onClick(e, value)}>
          {renderContent()}
        </CardActionArea>
      ) : (
        renderContent()
      )}
      {!!onDelete && (
        <CardActions
          sx={{ position: "absolute", height: "100%", top: 0, right: 0 }}
        >
          <IconButton onClick={(e) => onDelete(e, value)}>
            <Delete />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );
};

export default FileCard;
