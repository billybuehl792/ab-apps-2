export enum WorkOrderStatus {
  New = "new",
  InProgress = "in_progress",
  Completed = "completed",
  Canceled = "canceled",
}

/** API */

export enum WorkOrderOrdering {
  CreatedAt = "created_at",
  FirstName = "first_name",
  LastName = "last_name",
}
