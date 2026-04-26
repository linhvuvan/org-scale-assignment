import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Label } from "../components/common/Label";
import { Link } from "../components/common/Link";
import { Textarea } from "../components/common/Textarea";
import { useCreateCampaign } from "../hooks/useCreateCampaign";

export function NewCampaign() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipients, setRecipients] = useState<string[]>([""]);
  const { createCampaign, isMutating, errorMessage } = useCreateCampaign();

  function updateRecipient(index: number, value: string) {
    setRecipients((prev) => prev.map((r, i) => (i === index ? value : r)));
  }

  function removeRecipient(index: number) {
    setRecipients((prev) => prev.filter((_, i) => i !== index));
  }

  function addRecipient() {
    setRecipients((prev) => [...prev, ""]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const recipientEmails = recipients.filter((r) => r.trim() !== "");
    const ok = await createCampaign({ name, subject, body, recipientEmails });
    if (ok) navigate("/campaigns");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">New Campaign</h1>
        <Link to="/campaigns">← Back</Link>
      </div>

      <div className="bg-white rounded-2xl shadow p-8 max-w-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              required
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Recipients</Label>
            {recipients.map((email, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => updateRecipient(i, e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => removeRecipient(i)}
                  disabled={recipients.length === 1}
                >
                  ×
                </Button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRecipient}
              className="text-sm text-blue-600 hover:underline self-start"
            >
              + Add recipient
            </button>
          </div>

          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

          <Button type="submit" disabled={isMutating}>
            {isMutating ? "Creating..." : "Create Campaign"}
          </Button>
        </form>
      </div>
    </div>
  );
}
