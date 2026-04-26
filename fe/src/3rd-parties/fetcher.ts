export async function postFetcher<T>(url: string, { arg }: { arg: T }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message || "Something went wrong");
  }
  return res.json();
}
