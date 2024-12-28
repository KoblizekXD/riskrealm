import { SessionProvider } from "next-auth/react";
import SignInPage from "./login";

export default function SignIn() {
  return (
    <SessionProvider>
      <SignInPage />
    </SessionProvider>
  )
}