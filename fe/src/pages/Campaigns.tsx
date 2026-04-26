import { useState } from "react";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { PAGE_SIZE } from "../config/constants";
import { useGetCampaigns } from "../hooks/useGetCampaigns";

export function Campaigns() {
  const [page, setPage] = useState(1);
  const { campaigns, total, isLoading, errorMessage } = useGetCampaigns(page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Campaigns</h1>

      {errorMessage && (
        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
      )}

      <div className={`overflow-hidden rounded-lg border border-gray-200 ${isLoading ? "opacity-50" : ""}`}>
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Body</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {campaigns.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 text-gray-800">{c.name}</td>
                <td className="px-4 py-3 text-gray-800">{c.subject}</td>
                <td className="px-4 py-3 text-gray-800">{c.body}</td>
                <td className="px-4 py-3">
                  <Badge variant={c.status}>{c.status}</Badge>
                </td>
              </tr>
            ))}
            {!isLoading && campaigns.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400">No campaigns found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>
            Previous
          </Button>
          <Button variant="secondary" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
