import z from "zod";
import {
  accessTokenResponseSchema,
  credentialsSchema,
  resetPasswordRequestSchema,
  requestPasswordResetRequestSchema,
  userCreateRequestSchema,
  userListRequestSchema,
  userListResponseSchema,
  userSchema,
  userUpdateRequestSchema,
} from "../schemas/account";

export type TAccessTokenResponse = z.infer<typeof accessTokenResponseSchema>;

export type TCredentials = z.infer<typeof credentialsSchema>;

export type TRequestPasswordResetRequest = z.infer<
  typeof requestPasswordResetRequestSchema
>;

export type TResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;

export type TUser = z.infer<typeof userSchema>;

export type TUserCreateRequest = z.infer<typeof userCreateRequestSchema>;

export type TUserUpdateRequest = z.infer<typeof userUpdateRequestSchema>;

export type TUserListRequest = z.infer<typeof userListRequestSchema>;

export type TUserListResponse = z.infer<typeof userListResponseSchema>;
