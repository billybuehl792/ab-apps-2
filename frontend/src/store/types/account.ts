import z from "zod";
import {
  accessTokenResponseSchema,
  credentialsSchema,
  resetPasswordRequestSchema,
  requestPasswordResetRequestSchema,
  userCreateSchema,
  userListRequestSchema,
  userListResponseSchema,
  userSchema,
  userUpdateSchema,
} from "../schemas/account";

export type TAccessTokenResponse = z.infer<typeof accessTokenResponseSchema>;

export type TCredentials = z.infer<typeof credentialsSchema>;

export type TRequestPasswordResetRequest = z.infer<
  typeof requestPasswordResetRequestSchema
>;

export type TResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;

export type TUser = z.infer<typeof userSchema>;

export type TUserCreate = z.infer<typeof userCreateSchema>;

export type TUserUpdate = z.infer<typeof userUpdateSchema>;

export type TUserListRequest = z.infer<typeof userListRequestSchema>;

export type TUserListResponse = z.infer<typeof userListResponseSchema>;
