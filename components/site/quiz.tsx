"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SiteContent } from "@/lib/content";
import { cn } from "@/lib/utils";
import { StatefulButton } from "@/components/ui/stateful-button";

type QuizProps = {
  quiz: SiteContent["sections"]["recap"]["quiz"];
};

type QuizState = "idle" | "loading" | "success" | "error";

/**
 * Interactive quiz: pick an answer, then use the stateful button to check correctness.
 */
export function Quiz({ quiz }: QuizProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<QuizState>("idle");
  const [feedback, setFeedback] = useState<string>("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const correctLabel = useMemo(
    () => quiz.options.find((option) => option.isCorrect)?.label,
    [quiz.options]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setState("idle");
    setFeedback("");
  }, [selected]);

  const handleCheck = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!selected) {
      setState("error");
      setFeedback("Pick an answer first.");
      timerRef.current = setTimeout(() => setState("idle"), 1400);
      return;
    }

    setState("loading");
    timerRef.current = setTimeout(() => {
      const isCorrect = selected === correctLabel;
      setState(isCorrect ? "success" : "error");
      setFeedback(
        isCorrect
          ? quiz.answerNote
          : "Not quite. Try another option; GAA hugs the channel best."
      );
      timerRef.current = setTimeout(() => setState("idle"), 2000);
    }, 520);
  };

  return (
    <div className="rounded-xl border border-[color-mix(in_srgb,var(--line)_80%,transparent_20%)] bg-[color-mix(in_srgb,var(--card)_90%,transparent_10%)] p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-fg">{quiz.title}</p>
          <p className="text-sm text-muted">{quiz.question}</p>
        </div>
        <span className="chip self-start text-[11px] font-semibold uppercase tracking-[0.08em]">
          Quiz
        </span>
      </div>

      <div className="mt-3 grid gap-2">
        {quiz.options.map((option) => {
          const isSelected = selected === option.label;
          const isCorrectShown =
            state === "success" && option.label === correctLabel;

          return (
            <label
              key={option.label}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition",
                "border-[color-mix(in_srgb,var(--line)_70%,transparent_30%)]",
                isSelected
                  ? "border-[color-mix(in_srgb,var(--accent)_65%,transparent_35%)] bg-[color-mix(in_srgb,var(--card)_92%,transparent_8%)] shadow-[0_10px_30px_-22px_var(--accent)]"
                  : "bg-[color-mix(in_srgb,var(--card)_94%,transparent_6%)] hover:border-[color-mix(in_srgb,var(--accent)_50%,transparent_50%)]"
              )}
            >
              <input
                type="radio"
                name="recap-quiz"
                value={option.label}
                className="sr-only"
                onChange={() => setSelected(option.label)}
              />
              <span className="chip text-[11px] font-semibold uppercase tracking-[0.08em]">
                {option.label.substring(0, 2)}
              </span>
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-fg">{option.label}</span>
                {isSelected ? (
                  <span className="text-xs text-muted">
                    Selected - press Check Answer
                  </span>
                ) : null}
              </div>
              {isCorrectShown ? (
                <span className="chip bg-[color-mix(in_srgb,var(--accent)_16%,var(--card)_84%)] text-[11px] font-semibold text-fg">
                  Correct
                </span>
              ) : null}
            </label>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <StatefulButton
          state={state}
          labels={{
            idle: "Check answer",
            loading: "Checking...",
            success: "Correct!",
            error: "Try again"
          }}
          onClick={handleCheck}
        />
        <p
          className={cn(
            "text-sm",
            state === "success"
              ? "text-[color-mix(in_srgb,var(--accent)_75%,var(--muted)_25%)]"
              : state === "error"
                ? "text-[color-mix(in_srgb,var(--accent2)_75%,var(--muted)_25%)]"
                : "text-muted"
          )}
        >
          {feedback || "Pick an option, then tap Check to see if you're right."}
        </p>
      </div>
    </div>
  );
}
