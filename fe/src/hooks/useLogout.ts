import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { API_URL } from "../config/env";
import { postFetcher } from "../3rd-parties/fetcher";

export function useLogout() {
  const [errorMessage, setErrorMessage] = useState("");
  const { trigger, isMutating } = useSWRMutation(
    `${API_URL}/auth/logout`,
    postFetcher,
  );

  async function logout(): Promise<boolean> {
    setErrorMessage("");
    try {
      await trigger({});
      return true;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Logout failed");
      return false;
    }
  }

  return { logout, isMutating, errorMessage };
}
