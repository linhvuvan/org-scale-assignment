import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { API_URL } from "../config/env";
import { postFetcher } from "../3rd-parties/fetcher";

type LoginArgs = { email: string; password: string };

export function useLogin() {
  const [errorMessage, setErrorMessage] = useState("");
  const { trigger, isMutating } = useSWRMutation(
    `${API_URL}/auth/login`,
    postFetcher<LoginArgs>,
  );

  async function login(args: LoginArgs): Promise<boolean> {
    setErrorMessage("");
    try {
      await trigger(args);
      return true;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Login failed");
      return false;
    }
  }

  return { login, isMutating, errorMessage };
}
