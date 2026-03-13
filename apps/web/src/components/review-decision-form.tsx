"use client";

import { useState } from "react";
import {
  ReviewDecisionInputSchema,
  TaskRunDetailSchema,
  type ReviewVerdict,
  type TaskRunDetail
} from "@agora/shared/domain";
import { browserApiBasePath } from "../lib/api";
import { isReadOnlyPreviewMode } from "../lib/runtime";

const verdicts: ReviewVerdict[] = ["approved", "needs_work", "rejected"];

type ReviewDecisionFormProps = {
  initialRun: TaskRunDetail;
};

export function ReviewDecisionForm({ initialRun }: ReviewDecisionFormProps) {
  const readOnlyPreview = isReadOnlyPreviewMode();
  const [run, setRun] = useState(initialRun);
  const [verdict, setVerdict] = useState<ReviewVerdict>("approved");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readOnlyPreview) {
      setError("Preview mode is read-only.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const parsed = ReviewDecisionInputSchema.safeParse({
      verdict,
      notes
    });

    if (!parsed.success) {
      setError("Invalid review input.");
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
      <h2>Operator Review</h2>
      {readOnlyPreview ? (
        <p className="small">
          Preview mode is active. Review submission is disabled.
        </p>
      ) : null}
      <form className="form" onSubmit={handleSubmit}>
        <label>
          <span>Verdict</span>
          <select
            value={verdict}
            onChange={(event) => setVerdict(event.target.value as ReviewVerdict)}
            disabled={readOnlyPreview}
          >
            {verdicts.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Notes</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            placeholder="Capture the operator judgment for this run."
            disabled={readOnlyPreview}
          />
        </label>

        <button type="submit" disabled={isSubmitting || readOnlyPreview}>
          {readOnlyPreview
            ? "Read-only preview"
            : isSubmitting
              ? "Submitting..."
              : "Submit review"}
        </button>
      </form>

      {run.reviewDecision ? (
        <div className="receipt">
          <h3>Latest review</h3>
          <p>
            Verdict: <strong>{run.reviewDecision.verdict}</strong>
          </p>
          <p>{run.reviewDecision.notes}</p>
        </div>
      ) : null}

      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
