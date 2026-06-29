import React from "react";
import dayjs from "dayjs";
import ListCard, { type IListCardProps } from "@/components/cards/ListCard";
import { DateTimeFormat } from "@/store/enums/datetime";
import type { THistoryEntry } from "@/store/types/basic";

export interface IHistoryListCardProps extends Omit<IListCardProps, "onClick"> {
  historyEntry: THistoryEntry;
  options?: IMenuOption[];
  onClick?: (historyEntry: THistoryEntry) => void;
}

const HistoryListCard: React.FC<IHistoryListCardProps> = ({
  historyEntry,
  options,
  onClick,
  ...props
}) => {
  return (
    <ListCard
      label={`${historyEntry.action} by ${historyEntry.user?.username ?? "-"}`}
      description={dayjs(historyEntry.history_date).format(
        DateTimeFormat.DATETIME_MERIDIEM,
      )}
      options={options}
      {...(!!onClick && { onClick: () => onClick?.(historyEntry) })}
      {...props}
    />
  );
};

export default HistoryListCard;
