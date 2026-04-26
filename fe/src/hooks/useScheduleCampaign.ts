import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { API_URL } from "../config/env";
import { postFetcher } from "../3rd-parties/fetcher";

type ScheduleArgs = { scheduledAt: string };

export function useScheduleCampaign(id: string) {
  const [errorMessage, setErrorMessage] = useState("");
  const { trigger, isMutating } = useSWRMutation(
    `${API_URL}/campaigns/${id}/schedule`,
    postFetcher<ScheduleArgs>,
  );

  async function scheduleCampaign(scheduledAt: string): Promise<boolean> {
    setErrorMessage("");
    try {
      await trigger({ scheduledAt });
      return true;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to schedule campaign");
      return false;
    }
  }

  return { scheduleCampaign, isMutating, errorMessage };
}
