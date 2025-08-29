import { type ComponentProps } from "react";
import Form from "@/components/forms/Form";
import SignInFormUsernameField from "./fields/SignInFormUsernameField";
import SignInFormPasswordField from "./fields/SignInFormPasswordField";
import type { Credentials } from "@/store/types";

export type SignInForm = Credentials;

const SignInForm = (props: ComponentProps<typeof Form<SignInForm>>) => {
  return (
    <Form submitLabel="Sign In" {...props}>
      <SignInFormUsernameField />
      <SignInFormPasswordField />
    </Form>
  );
};

export default SignInForm;
