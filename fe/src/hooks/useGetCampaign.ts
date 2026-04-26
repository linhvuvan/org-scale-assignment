import useSWR from "swr";
import { API_URL } from "../config/env";
import { getFetcher } from "../3rd-parties/fetcher";
import type { CampaignWithStats } from "../entities/campaign";

export function useGetCampaign(id: string) {
  const { data, isLoading, error, mutate } = useSWR<CampaignWithStats>(
    id ? `${API_URL}/campaigns/${id}` : null,
    getFetcher,
  );

  return {
    campaign: data,
    isLoading,
    errorMessage: error instanceof Error ? error.message : error ? "Something went wrong" : "",
    mutate,
  };
}
