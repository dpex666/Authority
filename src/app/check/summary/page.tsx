import { Suspense } from "react";
import CheckSummaryClient from "./CheckSummaryClient";

export default function CheckSummaryPage() {
  return (
    <Suspense>
      <CheckSummaryClient />
    </Suspense>
  );
}
