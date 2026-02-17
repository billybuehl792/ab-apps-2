export enum WorkOrderOptionId {
  Detail = "detail",
  Edit = "edit",
  Delete = "delete",
}

export enum WorkOrderStatus {
  New = "new",
  InProgress = "in_progress",
  Completed = "completed",
  Canceled = "canceled",
}

/** API */

export enum EWorkOrderListOrdering {
  CompletedDateAsc = "completed_date",
  CompletedDateDesc = "-completed_date",
  CostAsc = "cost",
  CostDesc = "-cost",
  CreatedAsc = "created_at",
  CreatedDesc = "-created_at",
  ScheduledDateAsc = "scheduled_date",
  ScheduledDateDesc = "-scheduled_date",
}
