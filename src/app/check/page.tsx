import { Suspense } from "react";
import CheckClient from "./CheckClient";

export const dynamic = "force-dynamic";

export default function CheckPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
      <CheckClient />
    </Suspense>
  );
}
