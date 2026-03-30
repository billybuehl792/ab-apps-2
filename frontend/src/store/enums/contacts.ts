export enum EContactOptionId {
  Detail = "detail",
  Edit = "edit",
  Delete = "delete",
}

/** API */

export enum EContactListOrdering {
  FirstNameAsc = "first_name",
  FirstNameDesc = "-first_name",
  LastNameAsc = "last_name",
  LastNameDesc = "-last_name",
  CreatedAtAsc = "created_at",
  CreatedAtDesc = "-created_at",
  UpdatedAtAsc = "updated_at",
  UpdatedAtDesc = "-updated_at",
}

export enum EContactTagListOrdering {
  LabelAsc = "label",
  LabelDesc = "-label",
  ColorAsc = "color",
  ColorDesc = "-color",
  CreatedAtAsc = "created_at",
  CreatedAtDesc = "-created_at",
  UpdatedAtAsc = "updated_at",
  UpdatedAtDesc = "-updated_at",
}
