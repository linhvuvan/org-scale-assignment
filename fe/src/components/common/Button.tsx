const variantClasses = {
  primary:
    "px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600",
  secondary:
    "px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:hover:bg-gray-200",
  link: "text-blue-600 hover:underline",
};

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: keyof typeof variantClasses;
};

export function Button({ variant = "primary", ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]}`}
    />
  );
}
