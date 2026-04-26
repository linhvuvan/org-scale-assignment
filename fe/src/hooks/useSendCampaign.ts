import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { API_URL } from "../config/env";
import { postFetcher } from "../3rd-parties/fetcher";

export function useSendCampaign(id: string) {
  const [errorMessage, setErrorMessage] = useState("");
  const { trigger, isMutating } = useSWRMutation(
    `${API_URL}/campaigns/${id}/send`,
    postFetcher<Record<string, never>>,
  );

  async function sendCampaign(): Promise<boolean> {
    setErrorMessage("");
    try {
      await trigger({});
      return true;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to send campaign");
      return false;
    }
  }

  return { sendCampaign, isMutating, errorMessage };
}
