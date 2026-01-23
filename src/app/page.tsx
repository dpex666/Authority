"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif";

export default function HomePage() {
  const router = useRouter();
  const startTimeRef = useRef<number>(0);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const handleScroll = () => {
      if (hasScrolledRef.current) {
        return;
      }
      if (window.scrollY > window.innerHeight * 0.8) {
        const detail = { event: "scroll_past_fold" };
        window.dispatchEvent(new CustomEvent("analytics", { detail }));
        console.log("[analytics]", detail);
        hasScrolledRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStart = () => {
    const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const detail = {
      event: "check_started",
      location: "hero_cta",
      elapsed_seconds: elapsedSeconds,
    };
    window.dispatchEvent(new CustomEvent("analytics", { detail }));
    console.log("[analytics]", detail);
    router.push("/quiz");
  };

  return (
    <div className="min-h-screen">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[640px] flex-col px-6 pb-28 md:px-12">
        <div
          className="absolute left-6 top-8 text-[18px] font-medium text-[#1a1a1a] md:left-12 md:top-12"
          style={{ fontFamily: FONT_STACK }}
        >
          authority
        </div>

        <main className="pt-[60px] md:pt-[120px]">
          <h1 className="max-w-[540px] text-[32px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#0a0a0a] md:text-[48px]">
            Before you sign. Before you hire. Before you delegate.
            <span className="mt-4 block font-normal leading-[1.2] tracking-[-0.02em] text-[#404040]">
              Know where your authority breaks.
            </span>
          </h1>

          <div className="mt-10 flex flex-col items-start">
            <button
              type="button"
              onClick={handleStart}
              aria-label="Start the 5-minute authority readiness check"
              className="inline-flex h-[52px] w-full items-center justify-center rounded-[8px] bg-[#0066FF] px-6 text-[18px] font-medium text-white transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-[#005CE6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066FF] md:h-[56px] md:w-auto"
            >
              Start 5-minute check
              <span className="ml-1">→</span>
            </button>
            <div className="mt-3 w-full text-center text-[14px] font-normal text-[#666666] md:w-auto md:self-center">
              {"Takes 5 min\u00A0·\u00A0Nothing stored\u00A0·\u00A0Get a shareable summary"}
            </div>
          </div>

          <section className="mt-20">
            <h2 className="text-[16px] font-medium text-[#1a1a1a]">What you&apos;ll discover:</h2>
            <ul className="mt-5 space-y-4 text-[16px] font-normal leading-[1.6] text-[#2a2a2a]">
              <li className="flex items-start gap-3">
                <span className="text-[20px] text-[#00A86B]">✓</span>
                <span>Who can actually make decisions (and who thinks they can)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[20px] text-[#00A86B]">✓</span>
                <span>Where authority is unclear or assumed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[20px] text-[#00A86B]">✓</span>
                <span>What breaks when you&apos;re unavailable</span>
              </li>
            </ul>
          </section>
        </main>
      </div>

      <footer className="fixed bottom-6 left-1/2 w-full max-w-[640px] -translate-x-1/2 px-6 md:px-12">
        <p className="text-[10px] text-[#999999]">
          This is an informational tool. Not legal advice. If you&apos;re unsure, speak to a qualified
          professional.
        </p>
      </footer>
    </div>
  );
}
