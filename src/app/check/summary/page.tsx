import { Suspense } from "react";
import CheckSummaryClient from "./CheckSummaryClient";

export const dynamic = "force-dynamic";

export default function CheckSummaryPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
      <CheckSummaryClient />
    </Suspense>
  );
}
