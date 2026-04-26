const variantClasses = {
  primary:
    "bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50",
  secondary:
    "bg-gray-200 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-300",
};

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: keyof typeof variantClasses;
};

export function Button({ variant = "primary", ...rest }: ButtonProps) {
  return <button {...rest} className={variantClasses[variant]} />;
}
