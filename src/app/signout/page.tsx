'use client';

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function SignOut() {
  useEffect(() => {
    signOut({
      redirectTo: '/signin'
    });
  }, []);

  return <h1>Well, this is awkward.</h1>;
}