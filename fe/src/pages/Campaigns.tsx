import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Link } from "../components/common/Link";
import { Loader } from "../components/common/Loader";
import { PAGE_SIZE } from "../config/constants";
import { useGetCampaigns } from "../hooks/useGetCampaigns";
import { useLogout } from "../hooks/useLogout";
import { useLoggedIn } from "../hooks/useLocalStorage";

export function Campaigns() {
  const [page, setPage] = useState(1);
  const { campaigns, total, isLoading, errorMessage } = useGetCampaigns(page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const navigate = useNavigate();
  const { logout, isMutating } = useLogout();
  const { removeLoggedIn } = useLoggedIn();

  async function handleLogout() {
    await logout();
    removeLoggedIn();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Campaigns</h1>
        <div className="flex gap-2">
          <Link to="/campaigns/new">
            <Button>New Campaign</Button>
          </Link>
          <Button
            variant="secondary"
            onClick={handleLogout}
            disabled={isMutating}
          >
            Logout
          </Button>
        </div>
      </div>

      {errorMessage && (
        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
      )}

      <div className="flex flex-col gap-3">
        {campaigns.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 active:bg-gray-50"
            onClick={() => navigate(`/campaigns/${c.id}`)}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="font-medium text-gray-800">{c.name}</p>
              <Badge variant={c.status}>{c.status}</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1 truncate">{c.subject}</p>
            <p className="text-sm text-gray-400 truncate">{c.body}</p>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        )}
        {!isLoading && campaigns.length === 0 && (
          <p className="text-center text-gray-400 py-8">No campaigns found.</p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-y-2 mt-4">
        <span className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}
