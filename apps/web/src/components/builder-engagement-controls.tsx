"use client";

import { startTransition, useEffect, useState } from "react";
import {
  EngagementDeliverableInputSchema,
  EngagementDetailSchema,
  EngagementFeedbackStatusUpdateInputSchema,
  EngagementIncidentStatusUpdateInputSchema,
  EngagementStatusUpdateInputSchema,
  type EngagementDetail
} from "@agora/shared/domain";
import { useRouter } from "next/navigation";
import { browserApiBasePath } from "../lib/api";
import type { Locale } from "../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../lib/presenters";
import { isReadOnlyPreviewMode } from "../lib/runtime";

type BuilderEngagementControlsProps = {
  initialEngagement: EngagementDetail;
  locale: Locale;
};

const engagementStatuses = [
  "kickoff",
  "scoping",
  "building",
  "review",
  "delivered"
] as const;
const deliverableStatuses = [
  "planned",
  "in_progress",
  "in_review",
  "approved",
  "needs_work"
] as const;
const feedbackStatuses = ["submitted", "acknowledged", "planned", "resolved"] as const;
const incidentStatuses = ["open", "investigating", "mitigated", "resolved"] as const;

export function BuilderEngagementControls({
  initialEngagement,
  locale
}: BuilderEngagementControlsProps) {
  const router = useRouter();
  const readOnlyPreview = isReadOnlyPreviewMode();
  const [engagement, setEngagement] = useState(initialEngagement);
  const [deliverableTitle, setDeliverableTitle] = useState("");
  const [deliverableSummary, setDeliverableSummary] = useState("");
  const [deliverableType, setDeliverableType] = useState("");
  const [feedbackNotes, setFeedbackNotes] = useState<Record<string, string>>({});
  const [incidentNotes, setIncidentNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [pendingKey, setPendingKey] = useState("");

  useEffect(() => {
    setEngagement(initialEngagement);
    setFeedbackNotes(
      Object.fromEntries(
        initialEngagement.feedbackItems.map((item) => [
          item.id,
          item.responseNote ?? ""
        ])
      )
    );
    setIncidentNotes(
      Object.fromEntries(
        initialEngagement.incidents.map((item) => [item.id, item.responseNote ?? ""])
      )
    );
  }, [initialEngagement]);

  const t =
    locale === "zh"
      ? {
          eyebrow: "Builder 交付工作台",
          title: "让供给方真正推进交付，而不是只提交 proposal",
          previewDisabled: "当前是只读预览，这些交付动作已禁用。",
          deliveryStatus: "项目推进",
          deliverableTitle: "新增交付物",
          deliverableName: "交付物标题",
          deliverableSummary: "交付物说明",
          deliverableType: "交付物类型",
          deliverableSubmit: "新增交付物",
          feedbackTitle: "处理客户反馈",
          incidentTitle: "处理问题工单",
          responseNote: "处理说明",
          failed: "操作失败"
        }
      : {
          eyebrow: "Builder delivery workspace",
          title: "Give the builder a real delivery surface instead of only a proposal form",
          previewDisabled: "Preview mode is read-only. Delivery actions are disabled.",
          deliveryStatus: "Delivery progression",
          deliverableTitle: "Add deliverable",
          deliverableName: "Deliverable title",
          deliverableSummary: "Deliverable summary",
          deliverableType: "Artifact type",
          deliverableSubmit: "Add deliverable",
          feedbackTitle: "Process customer feedback",
          incidentTitle: "Process incident tickets",
          responseNote: "Response note",
          failed: "Operation failed"
        };

  async function syncEngagement(response: Response, fallbackError: string) {
    const payload = (await response.json()) as { item?: unknown; error?: string };
    const parsedItem = EngagementDetailSchema.safeParse(payload.item);

    if (!response.ok || !parsedItem.success) {
      throw new Error(payload.error ?? fallbackError);
    }

    setEngagement(parsedItem.data);
    setFeedbackNotes(
      Object.fromEntries(
        parsedItem.data.feedbackItems.map((item) => [item.id, item.responseNote ?? ""])
      )
    );
    setIncidentNotes(
      Object.fromEntries(
        parsedItem.data.incidents.map((item) => [item.id, item.responseNote ?? ""])
      )
    );
    startTransition(() => {
      router.refresh();
    });
  }

  async function applyEngagementStatus(status: (typeof engagementStatuses)[number]) {
    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingKey(`engagement:${status}`);

    const parsed = EngagementStatusUpdateInputSchema.safeParse({ status });
    if (!parsed.success) {
      setError(t.failed);
      setPendingKey("");
      return;
    }

    try {
      const response = await fetch(`${browserApiBasePath}/engagements/${engagement.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsed.data)
      });

      await syncEngagement(response, t.failed);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : t.failed);
    } finally {
      setPendingKey("");
    }
  }

  async function applyDeliverableStatus(
    deliverableId: string,
    status: (typeof deliverableStatuses)[number]
  ) {
    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingKey(`deliverable:${deliverableId}:${status}`);

    try {
      const response = await fetch(
        `${browserApiBasePath}/engagement-deliverables/${deliverableId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status })
        }
      );

      await syncEngagement(response, t.failed);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : t.failed);
    } finally {
      setPendingKey("");
    }
  }

  async function submitDeliverable(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingKey("new-deliverable");

    const parsed = EngagementDeliverableInputSchema.safeParse({
      title: deliverableTitle,
      summary: deliverableSummary,
      artifactType: deliverableType
    });

    if (!parsed.success) {
      setError(t.failed);
      setPendingKey("");
      return;
    }

    try {
      const response = await fetch(
        `${browserApiBasePath}/engagements/${engagement.id}/deliverables`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(parsed.data)
        }
      );

      await syncEngagement(response, t.failed);
      setDeliverableTitle("");
      setDeliverableSummary("");
      setDeliverableType("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.failed);
    } finally {
      setPendingKey("");
    }
  }

  async function applyFeedbackStatus(
    feedbackId: string,
    status: (typeof feedbackStatuses)[number]
  ) {
    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingKey(`feedback:${feedbackId}:${status}`);

    const parsed = EngagementFeedbackStatusUpdateInputSchema.safeParse({
      status,
      responseNote: feedbackNotes[feedbackId] ?? ""
    });

    if (!parsed.success) {
      setError(t.failed);
      setPendingKey("");
      return;
    }

    try {
      const response = await fetch(
        `${browserApiBasePath}/engagement-feedback/${feedbackId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(parsed.data)
        }
      );

      await syncEngagement(response, t.failed);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : t.failed);
    } finally {
      setPendingKey("");
    }
  }

  async function applyIncidentStatus(
    incidentId: string,
    status: (typeof incidentStatuses)[number]
  ) {
    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingKey(`incident:${incidentId}:${status}`);

    const parsed = EngagementIncidentStatusUpdateInputSchema.safeParse({
      status,
      responseNote: incidentNotes[incidentId] ?? ""
    });

    if (!parsed.success) {
      setError(t.failed);
      setPendingKey("");
      return;
    }

    try {
      const response = await fetch(
        `${browserApiBasePath}/engagement-incidents/${incidentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(parsed.data)
        }
      );

      await syncEngagement(response, t.failed);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : t.failed);
    } finally {
      setPendingKey("");
    }
  }

  return (
    <section className="panel">
      <div className="sectionhead">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2>{t.title}</h2>
      </div>
      {readOnlyPreview ? <p className="small">{t.previewDisabled}</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="surface-grid surface-grid-two">
        <section className="panel panel-subtle">
          <div className="sectionhead">
            <p className="eyebrow">{t.deliveryStatus}</p>
            <h3>{locale === "zh" ? "Builder 负责推进交付状态" : "The builder advances delivery status"}</h3>
          </div>
          <div className="buttonrow">
            {engagementStatuses.map((status) => (
              <button
                key={status}
                type="button"
                disabled={readOnlyPreview || pendingKey === `engagement:${status}`}
                onClick={() => applyEngagementStatus(status)}
              >
                {humanizeToken(status, locale)}
              </button>
            ))}
          </div>
        </section>

        <form className="form" onSubmit={submitDeliverable}>
          <h3>{t.deliverableTitle}</h3>
          <label>
            <span>{t.deliverableName}</span>
            <input
              value={deliverableTitle}
              onChange={(event) => setDeliverableTitle(event.target.value)}
              disabled={readOnlyPreview}
            />
          </label>
          <label>
            <span>{t.deliverableSummary}</span>
            <textarea
              value={deliverableSummary}
              onChange={(event) => setDeliverableSummary(event.target.value)}
              rows={4}
              disabled={readOnlyPreview}
            />
          </label>
          <label>
            <span>{t.deliverableType}</span>
            <input
              value={deliverableType}
              onChange={(event) => setDeliverableType(event.target.value)}
              disabled={readOnlyPreview}
            />
          </label>
          <button type="submit" disabled={readOnlyPreview || pendingKey === "new-deliverable"}>
            {t.deliverableSubmit}
          </button>
        </form>
      </div>

      <div className="timeline">
        {engagement.deliverables.map((deliverable) => (
          <article key={deliverable.id} className="timelineitem">
            <div className="timelinehead">
              <p className="tagline">{deliverable.title}</p>
              <span className={`statuspill ${toneClass(deliverable.status)}`}>
                {humanizeToken(deliverable.status, locale)}
              </span>
            </div>
            <p>{deliverable.summary}</p>
            <div className="buttonrow">
              {deliverableStatuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={
                    readOnlyPreview ||
                    pendingKey === `deliverable:${deliverable.id}:${status}`
                  }
                  onClick={() => applyDeliverableStatus(deliverable.id, status)}
                >
                  {humanizeToken(status, locale)}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="surface-grid surface-grid-two">
        <section className="panel panel-subtle">
          <div className="sectionhead">
            <p className="eyebrow">{t.feedbackTitle}</p>
            <h3>{locale === "zh" ? "Builder 需要回应现场反馈" : "The builder needs to respond to field feedback"}</h3>
          </div>
          <div className="timeline">
            {engagement.feedbackItems.map((item) => (
              <article key={item.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{item.title}</p>
                  <span className={`statuspill ${toneClass(item.status)}`}>
                    {humanizeToken(item.status, locale)}
                  </span>
                </div>
                <p>{item.details}</p>
                <p className="tagline">
                  {humanizeToken(item.category, locale)} / {formatTimestamp(item.createdAt, locale)}
                </p>
                <label className="stack">
                  <span>{t.responseNote}</span>
                  <textarea
                    value={feedbackNotes[item.id] ?? ""}
                    onChange={(event) =>
                      setFeedbackNotes((current) => ({
                        ...current,
                        [item.id]: event.target.value
                      }))
                    }
                    rows={3}
                    disabled={readOnlyPreview}
                  />
                </label>
                <div className="buttonrow">
                  {feedbackStatuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={readOnlyPreview || pendingKey === `feedback:${item.id}:${status}`}
                      onClick={() => applyFeedbackStatus(item.id, status)}
                    >
                      {humanizeToken(status, locale)}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel panel-subtle">
          <div className="sectionhead">
            <p className="eyebrow">{t.incidentTitle}</p>
            <h3>{locale === "zh" ? "Builder 需要处理交付问题" : "The builder needs to work incident tickets"}</h3>
          </div>
          <div className="timeline">
            {engagement.incidents.map((item) => (
              <article key={item.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{item.title}</p>
                  <span className={`statuspill ${toneClass(item.status)}`}>
                    {humanizeToken(item.status, locale)}
                  </span>
                </div>
                <p>{item.summary}</p>
                <p className="tagline">
                  {humanizeToken(item.severity, locale)} / {formatTimestamp(item.openedAt, locale)}
                </p>
                <label className="stack">
                  <span>{t.responseNote}</span>
                  <textarea
                    value={incidentNotes[item.id] ?? ""}
                    onChange={(event) =>
                      setIncidentNotes((current) => ({
                        ...current,
                        [item.id]: event.target.value
                      }))
                    }
                    rows={3}
                    disabled={readOnlyPreview}
                  />
                </label>
                <div className="buttonrow">
                  {incidentStatuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={readOnlyPreview || pendingKey === `incident:${item.id}:${status}`}
                      onClick={() => applyIncidentStatus(item.id, status)}
                    >
                      {humanizeToken(status, locale)}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
