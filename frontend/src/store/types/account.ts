import z from "zod";
import {
  accessTokenResponseSchema,
  companySchema,
  credentialsSchema,
  resetPasswordRequestSchema,
  sendPasswordResetEmailRequestSchema,
  userCreateSchema,
  userListRequestSchema,
  userListResponseSchema,
  userSchema,
  userUpdateSchema,
} from "../schemas/account";

export type TAccessTokenResponse = z.infer<typeof accessTokenResponseSchema>;

export type TCredentials = z.infer<typeof credentialsSchema>;

export type TSendPasswordResetEmailRequest = z.infer<
  typeof sendPasswordResetEmailRequestSchema
>;

export type TResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;

export type TCompany = z.infer<typeof companySchema>;

export type TUser = z.infer<typeof userSchema>;

export type TUserCreate = z.infer<typeof userCreateSchema>;

export type TUserUpdate = z.infer<typeof userUpdateSchema>;

export type TUserListRequest = z.infer<typeof userListRequestSchema>;

export type TUserListResponse = z.infer<typeof userListResponseSchema>;
