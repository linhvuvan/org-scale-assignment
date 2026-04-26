export function Textarea(props: React.ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
    />
  );
}
