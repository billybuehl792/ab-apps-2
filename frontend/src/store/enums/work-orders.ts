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

export enum WorkOrderApiListRequestOrdering {
  Cost = "cost",
  Created = "created_at",
  ScheduledDate = "scheduled_date",
  CompletedDate = "completed_date",
}
