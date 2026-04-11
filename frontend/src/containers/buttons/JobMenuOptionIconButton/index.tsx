import useJob, {
  type IUseJobOptions,
  type TUseJob,
} from "@/store/hooks/useJob";
import MenuOptionIconButton, {
  type IMenuOptionIconButtonProps,
} from "@/components/buttons/MenuOptionIconButton";
import type { TJob } from "@/store/types/jobs";

type TMenuOptionIconButtonProps = Omit<
  IMenuOptionIconButtonProps<TUseJob["options"]>,
  "options"
>;

interface IJobMenuOptionIconButtonProps
  extends TMenuOptionIconButtonProps, IUseJobOptions {
  job: TJob | TJob["id"];
}

const JobMenuOptionIconButton: React.FC<IJobMenuOptionIconButtonProps> = ({
  job,
  options,
  hideOptions,
  disabled,
  onChange,
  ...props
}) => {
  /** Values */

  const jobHook = useJob(job, {
    disabled,
    options,
    hideOptions,
    onChange,
  });

  return (
    <MenuOptionIconButton
      title={jobHook.job.label || `Job ${jobHook.job.id}`}
      disabled={jobHook.disabled}
      loading={jobHook.isLoading}
      options={jobHook.options}
      {...props}
    />
  );
};

export default JobMenuOptionIconButton;
