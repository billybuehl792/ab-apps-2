import { type Accept, useDropzone } from "react-dropzone";
import { Button, Stack, type StackProps } from "@mui/material";
import { FileUpload } from "@mui/icons-material";
import FileCard, { type IFileCardProps } from "@/containers/cards/FileCard";

type TFileFieldBaseProps = Omit<StackProps, "value" | "onChange"> & {
  accept?: Accept;
  label?: string;
  disabled?: boolean;
};

type TSingleFileFieldProps = TFileFieldBaseProps & {
  multiple?: false;
  value: File | null;
  onChange: (newValue: File | null) => void;
};

type TMultipleFileFieldProps = TFileFieldBaseProps & {
  multiple: true;
  value: File[];
  onChange: (newValue: File[]) => void;
};

export type TFileFieldProps = TSingleFileFieldProps | TMultipleFileFieldProps;

const getFileKey = (file: File) => `${file.name}-${file.size}-${file.type}`;

const FileField: React.FC<TFileFieldProps> = ({
  label: labelProp,
  value,
  multiple,
  accept,
  disabled,
  onChange,
  ...props
}) => {
  /** Values */

  const label = labelProp ?? (multiple ? "Select files" : "Select file");
  const files = Array.isArray(value) ? value : value ? [value] : [];

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    multiple,
    accept,
    disabled,
    onDropAccepted: (files) => {
      if (multiple) onChange([...value, ...files]);
      else onChange(files[0]);
    },
  });

  /** Callbacks */

  const handleOnFileDelete: IFileCardProps["onDelete"] = (_, fileToDelete) => {
    if (multiple)
      onChange(
        value.filter((file) => getFileKey(file) !== getFileKey(fileToDelete)),
      );
    else onChange(null);
  };

  return (
    <Stack {...props}>
      <Stack spacing={1} mb={1}>
        {files.map((file) => (
          <FileCard
            key={getFileKey(file)}
            value={file}
            onDelete={handleOnFileDelete}
          />
        ))}
      </Stack>
      <Button
        component="span"
        startIcon={<FileUpload />}
        {...getRootProps()}
        sx={[
          {
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 1,
            cursor: "pointer",
          },
          isDragActive && { borderColor: "primary.main", opacity: 0.5 },
        ]}
      >
        <input {...getInputProps()} />
        {label}
      </Button>
    </Stack>
  );
};

export default FileField;
