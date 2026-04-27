import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Loader } from "../components/common/Loader";
import { useGetCampaign } from "../hooks/useGetCampaign";
import { useScheduleCampaign } from "../hooks/useScheduleCampaign";
import { useSendCampaign } from "../hooks/useSendCampaign";
import { useDeleteCampaign } from "../hooks/useDeleteCampaign";

export function CampaignDetail() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { campaign, isLoading, errorMessage, mutate } = useGetCampaign(id);
  const { scheduleCampaign, isMutating: isScheduling, errorMessage: scheduleError } = useScheduleCampaign(id);
  const { sendCampaign, isMutating: isSending, errorMessage: sendError } = useSendCampaign(id);
  const { deleteCampaign, isMutating: isDeleting, errorMessage: deleteError } = useDeleteCampaign(id);

  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");

  async function handleSchedule() {
    const ok = await scheduleCampaign(new Date(scheduledAt).toISOString());
    if (ok) {
      setShowSchedule(false);
      mutate();
    }
  }

  async function handleSend() {
    const ok = await sendCampaign();
    if (ok) mutate();
  }

  async function handleDelete() {
    const ok = await deleteCampaign();
    if (ok) navigate("/campaigns");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (errorMessage || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <p className="text-red-500">{errorMessage || "Campaign not found."}</p>
      </div>
    );
  }

  const sendRatePct = Math.round(campaign.stats.sendRate * 100);
  const openRatePct = Math.round(campaign.stats.openRate * 100);
  const actionError = scheduleError || sendError || deleteError;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <Button variant="link" onClick={() => navigate(-1)}>← Back</Button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-800">{campaign.name}</h1>
          <Badge variant={campaign.status}>{campaign.status}</Badge>
        </div>
        <div className="flex gap-2">
          {campaign.status === "draft" && !showSchedule && (
            <>
              <Button onClick={() => setShowSchedule(true)} disabled={isScheduling || isDeleting}>
                Schedule
              </Button>
              <Button
                variant="secondary"
                onClick={handleDelete}
                disabled={isDeleting || isScheduling}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </>
          )}
          {campaign.status === "scheduled" && (
            <Button onClick={handleSend} disabled={isSending}>
              {isSending ? "Sending..." : "Send"}
            </Button>
          )}
        </div>
      </div>

      {actionError && <p className="text-red-500 text-sm mb-4">{actionError}</p>}

      {showSchedule && (
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6 mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-medium text-gray-500 uppercase">Schedule at</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSchedule} disabled={!scheduledAt || isScheduling}>
              {isScheduling ? "Scheduling..." : "Confirm"}
            </Button>
            <Button variant="secondary" onClick={() => setShowSchedule(false)} disabled={isScheduling}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow p-6 sm:p-8 w-full mb-6">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Subject</p>
            <p className="text-gray-800">{campaign.subject}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Body</p>
            <p className="text-gray-800 whitespace-pre-wrap">{campaign.body}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 sm:p-8">
        <h2 className="text-sm font-semibold text-gray-700 uppercase mb-4">Stats</h2>
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Send Rate</span>
              <span>{sendRatePct}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${sendRatePct}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{campaign.stats.sent} of {campaign.stats.total} sent</p>
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Open Rate</span>
              <span>{openRatePct}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${openRatePct}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{campaign.stats.opened} of {campaign.stats.sent} opened</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
