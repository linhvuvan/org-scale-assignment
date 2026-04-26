import { Link as RouterLink } from "react-router-dom";

type LinkProps = React.ComponentProps<typeof RouterLink>;

export function Link(props: LinkProps) {
  return <RouterLink {...props} className="text-blue-600 hover:underline" />;
}
