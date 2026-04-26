import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { API_URL } from "../config/env";
import { deleteFetcher } from "../3rd-parties/fetcher";

export function useDeleteCampaign(id: string) {
  const [errorMessage, setErrorMessage] = useState("");
  const { trigger, isMutating } = useSWRMutation(
    `${API_URL}/campaigns/${id}`,
    deleteFetcher,
  );

  async function deleteCampaign(): Promise<boolean> {
    setErrorMessage("");
    try {
      await trigger();
      return true;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to delete campaign");
      return false;
    }
  }

  return { deleteCampaign, isMutating, errorMessage };
}
