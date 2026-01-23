import { Badge } from "./Badge";

export function Pill({ children }: { children: React.ReactNode }) {
  return <Badge>{children}</Badge>;
}
