import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { API_URL } from "../config/env";
import { postFetcher } from "../3rd-parties/fetcher";

type CreateCampaignArgs = {
  name: string;
  subject: string;
  body: string;
  recipientEmails: string[];
};

export function useCreateCampaign() {
  const [errorMessage, setErrorMessage] = useState("");
  const { trigger, isMutating } = useSWRMutation(
    `${API_URL}/campaigns`,
    postFetcher<CreateCampaignArgs>,
  );

  async function createCampaign(args: CreateCampaignArgs): Promise<boolean> {
    setErrorMessage("");
    try {
      await trigger(args);
      return true;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to create campaign");
      return false;
    }
  }

  return { createCampaign, isMutating, errorMessage };
}
