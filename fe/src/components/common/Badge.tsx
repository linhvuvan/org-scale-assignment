const variantClasses = {
  draft: "bg-gray-100 text-gray-600",
  scheduled: "bg-blue-100 text-blue-700",
  sent: "bg-green-100 text-green-700",
};

type BadgeProps = {
  variant: keyof typeof variantClasses;
  children: React.ReactNode;
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
