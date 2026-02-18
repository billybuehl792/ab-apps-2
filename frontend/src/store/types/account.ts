import z from "zod";
import {
  accessTokenResponseSchema,
  changePasswordRequestSchema,
  companySchema,
  credentialsSchema,
  userCreateSchema,
  userListRequestSchema,
  userListResponseSchema,
  userSchema,
  userUpdateSchema,
} from "../schemas/account";

export type TAccessTokenResponse = z.infer<typeof accessTokenResponseSchema>;

export type TCredentials = z.infer<typeof credentialsSchema>;

export type TChangePasswordRequest = z.infer<
  typeof changePasswordRequestSchema
>;

export type TCompany = z.infer<typeof companySchema>;

export type TUser = z.infer<typeof userSchema>;

export type TUserCreate = z.infer<typeof userCreateSchema>;

export type TUserUpdate = z.infer<typeof userUpdateSchema>;

export type TUserListRequest = z.infer<typeof userListRequestSchema>;

export type TUserListResponse = z.infer<typeof userListResponseSchema>;
