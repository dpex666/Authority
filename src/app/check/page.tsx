import { Suspense } from "react";
import AuthorityCheckFlow from "@/components/AuthorityCheckFlow";

export default function CheckPage() {
  return (
    <Suspense>
      <AuthorityCheckFlow />
    </Suspense>
  );
}
