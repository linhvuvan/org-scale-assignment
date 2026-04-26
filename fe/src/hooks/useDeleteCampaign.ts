import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { API_URL } from "../config/env";
import { deleteFetcher } from "../3rd-parties/fetcher";

export function useDeleteCampaign(id: string) {
  const [errorMessage, setErrorMessage] = useState("");
  /**
   * revalidate: false — prevents SWR from re-fetching the campaign after deletion
   * useGetCampaign shares this key and would GET a now-gone resource (404)
   */
  const { trigger, isMutating } = useSWRMutation(
    `${API_URL}/campaigns/${id}`,
    deleteFetcher,
    { revalidate: false },
  );

  async function deleteCampaign(): Promise<boolean> {
    setErrorMessage("");
    try {
      await trigger();
      return true;
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to delete campaign",
      );
      return false;
    }
  }

  return { deleteCampaign, isMutating, errorMessage };
}
