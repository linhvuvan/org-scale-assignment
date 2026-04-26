const variantClasses = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600",
  secondary:
    "bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:hover:bg-gray-200",
};

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: keyof typeof variantClasses;
};

export function Button({ variant = "primary", ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`cursor-pointer disabled:cursor-not-allowed px-4 py-2 text-sm font-medium rounded-lg  disabled:opacity-50 ${variantClasses[variant]}`}
    />
  );
}
