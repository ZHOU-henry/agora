"use client";

import { useState } from "react";
import {
  TaskRequestInputSchema,
  TaskRequestDetailSchema,
  type TaskRequestDetail
} from "@agora/shared/domain";
import { browserApiBasePath } from "../lib/api";
import { isReadOnlyPreviewMode } from "../lib/runtime";

type TaskIntakeFormProps = {
  agentId: string;
  agentName: string;
};

export function TaskIntakeForm({ agentId, agentName }: TaskIntakeFormProps) {
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
      setError("Preview mode is read-only.");
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
      setError("Please complete the task form with a clear title and description.");
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
        throw new Error(payload.error ?? "Task submission failed");
      }

      setSubmitted(parsedItem.data);
      setTitle("");
      setDescription("");
      setContextNote("");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Task submission failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <h2>Submit A Task To {agentName}</h2>
      {readOnlyPreview ? (
        <p className="small">
          Preview mode is active. Task submission is intentionally disabled.
        </p>
      ) : null}
      <form className="form" onSubmit={handleSubmit}>
        <label>
          <span>Task title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Summarize the top risks in this workflow"
            disabled={readOnlyPreview}
          />
        </label>

        <label>
          <span>Task description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
            placeholder="Describe the task, goal, and what a good result should look like."
            disabled={readOnlyPreview}
          />
        </label>

        <label>
          <span>Optional context</span>
          <textarea
            value={contextNote}
            onChange={(event) => setContextNote(event.target.value)}
            rows={4}
            placeholder="Add any useful project context or constraints."
            disabled={readOnlyPreview}
          />
        </label>

        <button type="submit" disabled={isSubmitting || readOnlyPreview}>
          {readOnlyPreview
            ? "Read-only preview"
            : isSubmitting
              ? "Submitting..."
              : "Submit task"}
        </button>
      </form>

      {error ? <p className="error">{error}</p> : null}

      {submitted ? (
        <div className="receipt">
          <h3>Task submitted</h3>
          <p>
            Request <code>{submitted.id}</code> is now <strong>{submitted.status}</strong>.
          </p>
          {submitted.runs[0] ? (
            <p>
              <a className="cardlink" href={`/runs/${submitted.runs[0].id}`}>
                Open run record
              </a>
            </p>
          ) : null}
          <p className="tagline">Created at {submitted.createdAt}</p>
        </div>
      ) : null}
    </section>
  );
}
