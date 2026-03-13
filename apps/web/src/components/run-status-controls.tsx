"use client";

import { useState } from "react";
import {
  RunStatusUpdateInputSchema,
  TaskRunDetailSchema,
  type TaskRunDetail,
  type TaskRunStatus
} from "@agora/shared/domain";
import { apiBaseUrl } from "../lib/api";
import { isReadOnlyPreviewMode } from "../lib/runtime";

const statusOptions: TaskRunStatus[] = ["running", "completed", "failed"];

type RunStatusControlsProps = {
  initialRun: TaskRunDetail;
};

export function RunStatusControls({ initialRun }: RunStatusControlsProps) {
  const readOnlyPreview = isReadOnlyPreviewMode();
  const [run, setRun] = useState(initialRun);
  const [message, setMessage] = useState("");
  const [resultSummary, setResultSummary] = useState("");
  const [resultPayloadText, setResultPayloadText] = useState("{}");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function applyStatus(status: TaskRunStatus) {
    setError("");

    if (readOnlyPreview) {
      setError("Preview mode is read-only.");
      return;
    }

    setIsSubmitting(true);

    let parsedPayload: Record<string, unknown> | null = null;

    try {
      parsedPayload =
        resultPayloadText.trim().length > 0
          ? (JSON.parse(resultPayloadText) as Record<string, unknown>)
          : null;
    } catch {
      setError("Result payload must be valid JSON.");
      setIsSubmitting(false);
      return;
    }

    const parsed = RunStatusUpdateInputSchema.safeParse({
      status,
      message,
      resultSummary,
      resultPayload: parsedPayload
    });

    if (!parsed.success) {
      setError("Invalid status update.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/task-runs/${run.id}/status`, {
        method: "PATCH",
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
              : "Run status update failed")
        );
      }

      setRun(parsedItem.data);
      setMessage("");
      setResultSummary("");
    } catch (updateError) {
      setError(
        updateError instanceof Error ? updateError.message : "Run status update failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <h2>Run Controls</h2>
      {readOnlyPreview ? (
        <p className="small">
          Preview mode is active. Run state changes are disabled.
        </p>
      ) : null}
      <p className="tagline">Current status: {run.status}</p>
      <label className="stack">
        <span>Status message</span>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Add an execution note"
          disabled={readOnlyPreview}
        />
      </label>
      <label className="stack">
        <span>Result summary</span>
        <textarea
          value={resultSummary}
          onChange={(event) => setResultSummary(event.target.value)}
          rows={3}
          placeholder="Capture the operator-facing outcome of this run."
          disabled={readOnlyPreview}
        />
      </label>
      <label className="stack">
        <span>Result payload (JSON)</span>
        <textarea
          value={resultPayloadText}
          onChange={(event) => setResultPayloadText(event.target.value)}
          rows={6}
          placeholder='{"summary":"Task completed","confidence":"medium"}'
          disabled={readOnlyPreview}
        />
      </label>
      <div className="buttonrow">
        {statusOptions.map((status) => (
          <button
            key={status}
            type="button"
            disabled={isSubmitting || readOnlyPreview}
            onClick={() => applyStatus(status)}
          >
            Mark {status}
          </button>
        ))}
      </div>
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
