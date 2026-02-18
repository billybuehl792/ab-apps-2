export enum EUserGroup {
  AbAdmin = "ab_admin",
  CompanyAdmin = "company_admin",
  Basic = "basic",
}

/** API */

export enum EUserListOrdering {
  CreatedAtAsc = "created_at",
  CreatedAtDesc = "-created_at",
  FirstNameAsc = "first_name",
  FirstNameDesc = "-first_name",
  GroupAsc = "group",
  GroupDesc = "-group",
  LastNameAsc = "last_name",
  LastNameDesc = "-last_name",
  UpdatedAtAsc = "updated_at",
  UpdatedAtDesc = "-updated_at",
}
