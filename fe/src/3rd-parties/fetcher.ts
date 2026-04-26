import { clearLoggedIn } from "../hooks/useLocalStorage";

function redirectIfUnauthorized(status: number, url: string) {
  if (status === 401 && !url.includes("login")) {
    clearLoggedIn();
    window.location.replace("/login?error=session_expired");
    throw new Error("Session expired");
  }
}

export async function getFetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    redirectIfUnauthorized(res.status, url);
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as { message?: string }).message || "Something went wrong",
    );
  }
  return res.json();
}

export async function postFetcher<T>(url: string, { arg }: { arg: T }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
    credentials: "include",
  });
  if (!res.ok) {
    redirectIfUnauthorized(res.status, url);
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as { message?: string }).message || "Something went wrong",
    );
  }
  return res.json();
}

export async function deleteFetcher(url: string) {
  const res = await fetch(url, { method: "DELETE", credentials: "include" });
  if (!res.ok) {
    redirectIfUnauthorized(res.status, url);
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as { message?: string }).message || "Something went wrong",
    );
  }
}
