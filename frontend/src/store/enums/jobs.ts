export enum EJobOptionId {
  Detail = "detail",
  Edit = "edit",
  Delete = "delete",
}

export enum EJobCategory {
  Roof = "Roof",
  Gutters = "Gutters",
  Siding = "Siding",
  Windows = "Windows",
  Skylights = "Skylights",
  Doors = "Doors",
  Repair = "Repair",
  Other = "Other",
}

/** API */

export enum EJobListOrdering {
  LabelAsc = "label",
  LabelDesc = "-label",
  AssigneeAsc = "assignee__last_name",
  AssigneeDesc = "-assignee__last_name",
  RecipientAsc = "recipient__last_name",
  RecipientDesc = "-recipient__last_name",
  ReferredByAsc = "referred_by__last_name",
  ReferredByDesc = "-referred_by__last_name",
  RepresentativeAsc = "representative__last_name",
  RepresentativeDesc = "-representative__last_name",
  PlaceAsc = "place__address_full",
  PlaceDesc = "-place__address_full",
  AmountAsc = "amount",
  AmountDesc = "-amount",
  CreatedAtAsc = "created_at",
  CreatedAtDesc = "-created_at",
  UpdatedAtAsc = "updated_at",
  UpdatedAtDesc = "-updated_at",
}
