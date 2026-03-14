"use client";

import { useState } from "react";
import {
  TaskRequestInputSchema,
  TaskRequestDetailSchema,
  type TaskRequestDetail
} from "@agora/shared/domain";
import { browserApiBasePath } from "../lib/api";
import type { Locale } from "../lib/locale";
import { formatTimestamp, humanizeToken } from "../lib/presenters";
import { isReadOnlyPreviewMode } from "../lib/runtime";

type TaskIntakeFormProps = {
  agentId: string;
  agentName: string;
  locale: Locale;
  copy: {
    eyebrow: string;
    title: (agentName: string) => string;
    lede: string;
    previewDisabled: string;
    seededPrompts: string;
    taskTitle: string;
    taskTitlePlaceholder: string;
    taskDescription: string;
    taskDescriptionPlaceholder: string;
    context: string;
    contextPlaceholder: string;
    submit: string;
    submitting: string;
    readOnly: string;
    invalid: string;
    failed: string;
    successTitle: string;
    successPrefix: string;
    openRun: string;
    createdAt: string;
  };
  exampleTasks?: string[];
};

export function TaskIntakeForm({
  agentId,
  agentName,
  locale,
  copy,
  exampleTasks = []
}: TaskIntakeFormProps) {
  const readOnlyPreview = isReadOnlyPreviewMode();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contextNote, setContextNote] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState<TaskRequestDetail | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readOnlyPreview) {
      setError(copy.previewDisabled);
      return;
    }

    setError("");
    setSubmitted(null);

    const parsed = TaskRequestInputSchema.safeParse({
      agentId,
      title,
      description,
      contextNote
    });

    if (!parsed.success) {
      setError(copy.invalid);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${browserApiBasePath}/task-requests`, {
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

      const parsedItem = TaskRequestDetailSchema.safeParse(payload.item);

      if (!response.ok || !parsedItem.success) {
        throw new Error(payload.error ?? copy.failed);
      }

      setSubmitted(parsedItem.data);
      setTitle("");
      setDescription("");
      setContextNote("");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : copy.failed
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <div className="sectionhead">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title(agentName)}</h2>
        <p className="lede small">{copy.lede}</p>
      </div>
      {readOnlyPreview ? (
        <p className="small">{copy.previewDisabled}</p>
      ) : null}
      {exampleTasks.length > 0 ? (
        <div className="microstack">
          <p className="microeyebrow">{copy.seededPrompts}</p>
          <div className="chiprow">
            {exampleTasks.map((task) => (
              <button
                key={task}
                type="button"
                className="chipbutton"
                onClick={() => {
                  setTitle(task);
                  setDescription(task);
                }}
                disabled={readOnlyPreview}
              >
                {task}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <form className="form" onSubmit={handleSubmit}>
        <label>
          <span>{copy.taskTitle}</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={copy.taskTitlePlaceholder}
            disabled={readOnlyPreview}
          />
        </label>

        <label>
          <span>{copy.taskDescription}</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
            placeholder={copy.taskDescriptionPlaceholder}
            disabled={readOnlyPreview}
          />
        </label>

        <label>
          <span>{copy.context}</span>
          <textarea
            value={contextNote}
            onChange={(event) => setContextNote(event.target.value)}
            rows={4}
            placeholder={copy.contextPlaceholder}
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

      {error ? <p className="error">{error}</p> : null}

      {submitted ? (
        <div className="receipt">
          <h3>{copy.successTitle}</h3>
          <p>
            {copy.successPrefix} <span className="inlinecode">{submitted.id}</span>{" "}
            <strong>{humanizeToken(submitted.status, locale)}</strong>.
          </p>
          {submitted.runs[0] ? (
            <p>
              <a className="cardlink" href={`/runs/${submitted.runs[0].id}`}>
                {copy.openRun}
              </a>
            </p>
          ) : null}
          <p className="tagline">
            {copy.createdAt} {formatTimestamp(submitted.createdAt, locale)}
          </p>
        </div>
      ) : null}
    </section>
  );
}
