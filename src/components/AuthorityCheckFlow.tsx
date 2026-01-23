"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QUESTIONS } from "@/lib/authority/questions";
import type { AnswerValue, AuthorityAnswers, AuthorityCheckState } from "@/lib/authority/types";
import { loadCheckState, saveCheckState, clearCheckState } from "@/lib/authority/storage";

/**
 * Source of truth:
 * - Questions: src/lib/authority/questions.ts
 * - Scoring: src/lib/authority/score.ts
 * - Report generation: src/lib/authority/report.ts
 * - Persistence: src/lib/authority/storage.ts
 */

const TOTAL_QUESTIONS = QUESTIONS.length;
const SCALE_OPTIONS: { value: AnswerValue; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "unsure", label: "Not sure" },
  { value: "na", label: "Not applicable" },
];

function clampQuestionNumber(value: number) {
  if (Number.isNaN(value) || value < 1) return 1;
  return Math.min(value, TOTAL_QUESTIONS);
}

function findFirstUnanswered(answers: AuthorityAnswers) {
  const index = QUESTIONS.findIndex((question) => !answers[question.id]);
  return index === -1 ? null : index + 1;
}

function track(detail: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("analytics", { detail }));
  console.log("[analytics]", detail);
}

export default function AuthorityCheckFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q");
  const viewParam = searchParams.get("view");
  const parsedQ = Number.parseInt(qParam ?? "", 10);
  const questionNumber = Number.isNaN(parsedQ) ? 1 : parsedQ;
  const currentQuestionNumber = clampQuestionNumber(questionNumber);
  const currentIndex = currentQuestionNumber - 1;
  const question = QUESTIONS[currentIndex];
  const progressPercent = Math.round((currentQuestionNumber / TOTAL_QUESTIONS) * 100);

  const [answers, setAnswers] = React.useState<AuthorityAnswers>({});
  const [resumeState, setResumeState] = React.useState<AuthorityCheckState | null>(null);
  const [showResumeModal, setShowResumeModal] = React.useState(false);
  const [allowSave, setAllowSave] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [fadePhase, setFadePhase] = React.useState<"in" | "out">("in");
  const [showSaved, setShowSaved] = React.useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  const savedTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionResetRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = React.useRef<number>(0);
  const lastViewedRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    startTimeRef.current = Date.now();
    const saved = loadCheckState();
    if (saved && Object.keys(saved.answers || {}).length > 0) {
      setResumeState(saved);
      setShowResumeModal(true);
      setAllowSave(false);
    } else {
      setAllowSave(true);
    }
  }, []);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const handler = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  React.useEffect(() => {
    if (!allowSave) return;
    saveCheckState({
      answers,
      currentQuestionNumber,
      updatedAt: Date.now(),
    });
  }, [answers, currentQuestionNumber, allowSave]);

  React.useEffect(() => {
    if (viewParam === "summary") {
      router.replace("/check/summary");
      return;
    }

    if (!qParam) {
      router.replace("/check?q=1");
      return;
    }

    if (!Number.isInteger(questionNumber) || questionNumber < 1 || questionNumber > TOTAL_QUESTIONS) {
      router.replace("/check?q=1");
    }
  }, [qParam, questionNumber, router, viewParam]);

  React.useEffect(() => {
    if (showResumeModal) return;
    const firstUnanswered = findFirstUnanswered(answers);
    if (firstUnanswered && questionNumber > firstUnanswered) {
      router.replace(`/check?q=${firstUnanswered}`);
    }
  }, [answers, questionNumber, router, showResumeModal]);

  React.useEffect(() => {
    if (showResumeModal) return;
    if (lastViewedRef.current === currentQuestionNumber) return;
    lastViewedRef.current = currentQuestionNumber;
    track({ event: "question_viewed", question_number: currentQuestionNumber });
  }, [currentQuestionNumber, showResumeModal]);

  React.useEffect(() => {
    const handleBeforeUnload = () => {
      const isComplete = findFirstUnanswered(answers) === null;
      if (isComplete) return;
      const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      track({
        event: "abandoned",
        last_question: currentQuestionNumber,
        time_spent_seconds: elapsedSeconds,
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [answers, currentQuestionNumber]);

  React.useEffect(() => {
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (transitionResetRef.current) clearTimeout(transitionResetRef.current);
    };
  }, []);

  const isLastQuestion = currentQuestionNumber === TOTAL_QUESTIONS;
  const currentAnswer = answers[question.id];
  const isNextDisabled = !currentAnswer || isTransitioning;

  const triggerSavedIndicator = () => {
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    setShowSaved(true);
    savedTimerRef.current = setTimeout(() => {
      setShowSaved(false);
    }, 2000);
  };

  const updateAnswer = (value: AnswerValue) => {
    setAnswers((prev) => {
      const prevValue = prev[question.id];
      if (prevValue === value) return prev;
      const next = { ...prev, [question.id]: value };
      if (prevValue) {
        track({
          event: "answer_changed",
          question_number: currentQuestionNumber,
          from: prevValue,
          to: value,
        });
      } else {
        track({
          event: "answer_selected",
          question_number: currentQuestionNumber,
          answer: value,
        });
      }
      triggerSavedIndicator();
      return next;
    });
  };

  const goToQuestion = (target: number) => {
    const clamped = clampQuestionNumber(target);
    if (prefersReducedMotion) {
      router.push(`/check?q=${clamped}`);
      return;
    }
    if (isTransitioning) return;
    setIsTransitioning(true);
    setFadePhase("out");
    transitionTimerRef.current = setTimeout(() => {
      router.push(`/check?q=${clamped}`);
      setFadePhase("in");
    }, 200);
    transitionResetRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 400);
  };

  const handleBack = () => {
    if (currentQuestionNumber === 1) return;
    track({ event: "clicked_back", from_question: currentQuestionNumber });
    goToQuestion(currentQuestionNumber - 1);
  };

  const handleNext = () => {
    track({ event: "clicked_next", from_question: currentQuestionNumber });
    if (isLastQuestion) {
      router.push("/check/summary");
      return;
    }
    goToQuestion(currentQuestionNumber + 1);
  };

  const handleResume = () => {
    if (!resumeState) return;
    setAnswers(resumeState.answers || {});
    const firstUnanswered = findFirstUnanswered(resumeState.answers || {});
    const target = firstUnanswered ?? clampQuestionNumber(resumeState.currentQuestionNumber || 1);
    setAllowSave(true);
    setShowResumeModal(false);
    track({ event: "resumed_check", resumed_at_question: target });
    router.replace(`/check?q=${target}`);
  };

  const handleRestart = () => {
    clearCheckState();
    setAnswers({});
    setAllowSave(true);
    setShowResumeModal(false);
    track({ event: "restarted_check" });
    router.replace("/check?q=1");
  };

  const renderOptions = () => {
    const options = question.type === "scale" ? SCALE_OPTIONS : question.options ?? [];
    return (
      <div
        className="grid gap-3"
        role="radiogroup"
        aria-label={question.title}
      >
        {options.map((option) => {
          const selected = currentAnswer === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => updateAnswer(option.value)}
              className={[
                "relative w-full min-h-[56px] rounded-[8px] border-2 px-5 py-4 text-left text-[16px] font-normal text-[#1a1a1a]",
                "transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066FF]",
                selected
                  ? "border-[#0066FF] bg-[#E6F0FF] font-medium"
                  : "border-transparent bg-[#F5F5F5] hover:border-[#D4D4D4] hover:bg-[#EBEBEB]",
              ].join(" ")}
            >
              {option.label}
              {selected ? (
                <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-[#0066FF]">
                  ✓
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="fixed left-0 top-0 z-20 h-1 w-full bg-[#E5E5E5]">
        <div
          className="h-full bg-[#0066FF] transition-[width] duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div
        className="fixed left-6 top-6 z-20 text-[14px] font-medium text-[#666666]"
        aria-label={`Question ${currentQuestionNumber} of ${TOTAL_QUESTIONS}, ${progressPercent} percent complete`}
      >
        Question {currentQuestionNumber} of {TOTAL_QUESTIONS}
      </div>

      <div className="mx-auto flex min-h-screen max-w-[580px] flex-col px-6 md:px-12">
        <div
          className={[
            "mt-[100px] rounded-[12px] bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-opacity duration-200 md:mt-[120px] md:p-12",
            fadePhase === "out" && !prefersReducedMotion ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.05em] text-[#0066FF]">
            Question {currentQuestionNumber}
          </div>
          <div className="mb-3 max-w-[480px] text-[20px] font-semibold leading-[1.4] text-[#0a0a0a] md:text-[24px]">
            {question.title}
          </div>
          {question.help ? (
            <div className="mb-8 max-w-[480px] text-[15px] font-normal leading-[1.6] text-[#525252]">
              {question.help}
            </div>
          ) : null}

          {renderOptions()}

          <div className="mt-10 flex items-center justify-between gap-4">
            {currentQuestionNumber === 1 ? (
              <div />
            ) : (
              <button
                type="button"
                onClick={handleBack}
                disabled={isTransitioning}
                className="inline-flex h-[44px] items-center justify-center rounded-[8px] border-2 border-[#D4D4D4] px-4 text-[14px] font-medium text-[#1a1a1a] transition-colors hover:border-[#999999] hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={isNextDisabled}
              aria-disabled={isNextDisabled}
              className={[
                "inline-flex h-[44px] items-center justify-center rounded-[8px] px-8 text-[16px] font-medium text-white transition-colors",
                isNextDisabled
                  ? "cursor-not-allowed bg-[#D4D4D4] text-[#999999]"
                  : "bg-[#0066FF] hover:bg-[#005CE6]",
              ].join(" ")}
            >
              {isLastQuestion ? "Finish" : "Next"}
            </button>
          </div>

          <div
            className={[
              "mt-6 text-[12px] text-[#999999] transition-opacity duration-200",
              showSaved ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            Progress saved automatically
          </div>
        </div>
      </div>

      {showResumeModal ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-[400px] rounded-[12px] bg-white p-8 shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
            <div className="text-[20px] font-semibold text-[#0a0a0a]">Welcome back</div>
            <div className="mt-3 text-[15px] leading-[1.6] text-[#525252]">
              You were on Question {resumeState?.currentQuestionNumber ?? 1} of {TOTAL_QUESTIONS}.
              Want to continue where you left off?
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleResume}
                className="inline-flex h-[44px] w-full items-center justify-center rounded-[8px] bg-[#0066FF] px-6 text-[16px] font-medium text-white hover:bg-[#005CE6]"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex h-[44px] w-full items-center justify-center rounded-[8px] border-2 border-[#D4D4D4] px-6 text-[16px] font-medium text-[#1a1a1a] hover:border-[#999999] hover:bg-[#F5F5F5]"
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
