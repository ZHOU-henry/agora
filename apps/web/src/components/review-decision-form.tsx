"use client";

import { useState } from "react";
import {
  ReviewDecisionInputSchema,
  TaskRunDetailSchema,
  type ReviewVerdict,
  type TaskRunDetail
} from "@agora/shared/domain";
import { browserApiBasePath } from "../lib/api";
import type { Locale } from "../lib/locale";
import { formatTimestamp, titleizeToken, toneClass } from "../lib/presenters";
import { isReadOnlyPreviewMode } from "../lib/runtime";

const verdicts: ReviewVerdict[] = ["approved", "needs_work", "rejected"];

type ReviewDecisionFormProps = {
  initialRun: TaskRunDetail;
  locale: Locale;
  copy: {
    eyebrow: string;
    title: string;
    previewDisabled: string;
    verdict: string;
    notes: string;
    notesPlaceholder: string;
    invalid: string;
    submit: string;
    submitting: string;
    readOnly: string;
    latest: string;
    verdictLabel: string;
    noNotes: string;
    reviewedAt: string;
  };
};

export function ReviewDecisionForm({
  initialRun,
  locale,
  copy
}: ReviewDecisionFormProps) {
  const readOnlyPreview = isReadOnlyPreviewMode();
  const [run, setRun] = useState(initialRun);
  const [verdict, setVerdict] = useState<ReviewVerdict>("approved");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readOnlyPreview) {
      setError(copy.previewDisabled);
      return;
    }

    setError("");
    setIsSubmitting(true);

    const parsed = ReviewDecisionInputSchema.safeParse({
      verdict,
      notes
    });

    if (!parsed.success) {
      setError(copy.invalid);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${browserApiBasePath}/task-runs/${run.id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsed.data)
      });

      const payload = (await response.json()) as {
        item?: unknown;
        error?: string;
      };

      const parsedItem = TaskRunDetailSchema.safeParse(payload.item);

      if (!response.ok || !parsedItem.success) {
        throw new Error(
          payload.error ??
            ("details" in payload && typeof payload.details === "object"
              ? JSON.stringify(payload.details)
              : "Review submission failed")
        );
      }

      setRun(parsedItem.data);
      setNotes("");
    } catch (reviewError) {
      setError(
        reviewError instanceof Error ? reviewError.message : "Review submission failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <div className="sectionhead">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
      </div>
      {readOnlyPreview ? (
        <p className="small">{copy.previewDisabled}</p>
      ) : null}
      <form className="form" onSubmit={handleSubmit}>
        <label>
          <span>{copy.verdict}</span>
          <select
            value={verdict}
            onChange={(event) => setVerdict(event.target.value as ReviewVerdict)}
            disabled={readOnlyPreview}
          >
            {verdicts.map((value) => (
              <option key={value} value={value}>
                {titleizeToken(value, locale)}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>{copy.notes}</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            placeholder={copy.notesPlaceholder}
            disabled={readOnlyPreview}
          />
        </label>

        <button type="submit" disabled={isSubmitting || readOnlyPreview}>
          {readOnlyPreview
            ? copy.readOnly
            : isSubmitting
              ? copy.submitting
              : copy.submit}
        </button>
      </form>

      {run.reviewDecision ? (
        <div className="receipt">
          <h3>{copy.latest}</h3>
          <p>
            {copy.verdictLabel}:{" "}
            <span className={`statuspill ${toneClass(run.reviewDecision.verdict)}`}>
              {titleizeToken(run.reviewDecision.verdict, locale)}
            </span>
          </p>
          <p>{run.reviewDecision.notes || copy.noNotes}</p>
          <p className="tagline">
            {copy.reviewedAt} {formatTimestamp(run.reviewDecision.reviewedAt, locale)}
          </p>
        </div>
      ) : null}

      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
