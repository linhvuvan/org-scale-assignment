import useSWR from "swr";
import { API_URL } from "../config/env";
import { PAGE_SIZE } from "../config/constants";
import { getFetcher } from "../3rd-parties/fetcher";
import type { Campaign } from "../entities/campaign";

type CampaignsResponse = {
  data: Campaign[];
  total: number;
  page: number;
  limit: number;
};

export function useGetCampaigns(page: number) {
  const { data, isLoading, error } = useSWR<CampaignsResponse>(
    `${API_URL}/campaigns?page=${page}&limit=${PAGE_SIZE}`,
    getFetcher,
  );

  return {
    campaigns: data?.data || [],
    total: data?.total || 0,
    isLoading,
    errorMessage: error instanceof Error ? error.message : error ? "Something went wrong" : "",
  };
}
