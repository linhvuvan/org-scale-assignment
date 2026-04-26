import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { API_URL } from "../config/env";
import { postFetcher } from "../3rd-parties/fetcher";

type RegisterArgs = { name: string; email: string; password: string };

export function useRegister() {
  const [errorMessage, setErrorMessage] = useState("");
  const { trigger, isMutating } = useSWRMutation(
    `${API_URL}/auth/register`,
    postFetcher<RegisterArgs>,
  );

  async function register(args: RegisterArgs): Promise<boolean> {
    setErrorMessage("");
    try {
      await trigger(args);
      return true;
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Registration failed",
      );
      return false;
    }
  }

  return { register, isMutating, errorMessage };
}
