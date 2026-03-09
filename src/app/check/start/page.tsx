"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { loadProfile, saveProfile, type AuthorityProfile } from "@/lib/authority/profile";

const PARTNER_REF_KEY = "authority_partner_ref";

function CheckStartInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = React.useState<AuthorityProfile>({ youName: "", partnerName: "" });

  React.useEffect(() => {
    setProfile(loadProfile());
    // Save partner comparison ref to sessionStorage if present
    const ref = searchParams.get("ref");
    if (ref) {
      sessionStorage.setItem(PARTNER_REF_KEY, ref);
    }
  }, [searchParams]);

  React.useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const canStart = profile.youName.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto flex min-h-screen max-w-[580px] flex-col px-6 md:px-12">
        <div className="mt-[120px] rounded-[12px] bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] md:p-12">
          <div className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#0066FF]">
            Authority check
          </div>
          <div className="mt-4 text-[24px] font-semibold leading-[1.4] text-[#0a0a0a] md:text-[28px]">
            Personalise your report
          </div>
          <div className="mt-3 text-[15px] leading-[1.6] text-[#525252]">
            Add your name so the report reads like it was written for you. This stays on your device.
          </div>

          <div className="mt-8 grid gap-4">
            <Input
              label="Your name"
              value={profile.youName}
              onChange={(e) => setProfile((prev) => ({ ...prev, youName: e.target.value }))}
              placeholder="e.g. Dan"
            />
            <Input
              label="Partner name (optional)"
              value={profile.partnerName || ""}
              onChange={(e) => setProfile((prev) => ({ ...prev, partnerName: e.target.value }))}
              placeholder="e.g. Kat"
            />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/check?q=1")}
              disabled={!canStart}
              className={[
                "inline-flex h-[44px] w-full items-center justify-center rounded-[8px] px-6 text-[16px] font-medium text-white transition-colors",
                canStart ? "bg-[#0066FF] hover:bg-[#005CE6]" : "cursor-not-allowed bg-[#D4D4D4] text-[#999999]",
              ].join(" ")}
            >
              Start the check
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex h-[44px] w-full items-center justify-center rounded-[8px] border-2 border-[#D4D4D4] px-6 text-[16px] font-medium text-[#1a1a1a] hover:border-[#999999] hover:bg-[#F5F5F5]"
            >
              Back home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckStartPage() {
  return (
    <Suspense>
      <CheckStartInner />
    </Suspense>
  );
}
