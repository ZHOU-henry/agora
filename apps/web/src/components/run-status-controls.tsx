"use client";

import { useState } from "react";
import {
  RunStatusUpdateInputSchema,
  TaskRunDetailSchema,
  type TaskRunDetail,
  type TaskRunStatus
} from "@agora/shared/domain";
import { browserApiBasePath } from "../lib/api";
import type { Locale } from "../lib/locale";
import { titleizeToken, toneClass } from "../lib/presenters";
import { isReadOnlyPreviewMode } from "../lib/runtime";

const statusOptions: TaskRunStatus[] = ["running", "completed", "failed"];

type RunStatusControlsProps = {
  initialRun: TaskRunDetail;
  locale: Locale;
  copy: {
    eyebrow: string;
    title: string;
    previewDisabled: string;
    currentStatus: string;
    statusMessage: string;
    statusMessagePlaceholder: string;
    resultSummary: string;
    resultSummaryPlaceholder: string;
    resultPayload: string;
    resultPayloadPlaceholder: string;
    invalidPayload: string;
    invalidUpdate: string;
    mark: (value: string) => string;
  };
};

export function RunStatusControls({
  initialRun,
  locale,
  copy
}: RunStatusControlsProps) {
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
      setError(copy.previewDisabled);
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
      setError(copy.invalidPayload);
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
      setError(copy.invalidUpdate);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${browserApiBasePath}/task-runs/${run.id}/status`, {
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
      <div className="sectionhead">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
      </div>
      {readOnlyPreview ? (
        <p className="small">{copy.previewDisabled}</p>
      ) : null}
      <p className="tagline">
        {copy.currentStatus}:{" "}
        <span className={`statuspill ${toneClass(run.status)}`}>
          {titleizeToken(run.status, locale)}
        </span>
      </p>
      <label className="stack">
        <span>{copy.statusMessage}</span>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={copy.statusMessagePlaceholder}
          disabled={readOnlyPreview}
        />
      </label>
      <label className="stack">
        <span>{copy.resultSummary}</span>
        <textarea
          value={resultSummary}
          onChange={(event) => setResultSummary(event.target.value)}
          rows={3}
          placeholder={copy.resultSummaryPlaceholder}
          disabled={readOnlyPreview}
        />
      </label>
      <label className="stack">
        <span>{copy.resultPayload}</span>
        <textarea
          value={resultPayloadText}
          onChange={(event) => setResultPayloadText(event.target.value)}
          rows={6}
          placeholder={copy.resultPayloadPlaceholder}
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
            {copy.mark(titleizeToken(status, locale))}
          </button>
        ))}
      </div>
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
