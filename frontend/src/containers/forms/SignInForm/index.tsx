import { type ComponentProps } from "react";
import Form from "@/components/forms/Form";
import SignInFormUsernameField from "./fields/SignInFormUsernameField";
import SignInFormPasswordField from "./fields/SignInFormPasswordField";
import type { Credentials } from "@/store/types/auth";

export type SignInFormValues = Credentials;

const SignInForm = (props: ComponentProps<typeof Form<SignInFormValues>>) => {
  return (
    <Form submitLabel="Sign In" {...props}>
      <SignInFormUsernameField />
      <SignInFormPasswordField />
    </Form>
  );
};

export default SignInForm;
