"use client";

import { startTransition, useEffect, useState } from "react";
import {
  CustomerConfirmationInputSchema,
  EngagementDetailSchema,
  EngagementFeedbackInputSchema,
  EngagementIncidentInputSchema,
  type EngagementDetail
} from "@agora/shared/domain";
import { useRouter } from "next/navigation";
import { browserApiBasePath } from "../lib/api";
import type { Locale } from "../lib/locale";
import { humanizeToken } from "../lib/presenters";
import { isReadOnlyPreviewMode } from "../lib/runtime";

type CustomerEngagementControlsProps = {
  initialEngagement: EngagementDetail;
  locale: Locale;
};

const confirmationStatuses = [
  "pending",
  "accepted",
  "issues_reported",
  "expansion_requested"
] as const;
const feedbackCategories = [
  "field_feedback",
  "environment_change",
  "maintenance_request",
  "expansion_signal"
] as const;
const incidentSeverities = ["low", "medium", "high", "critical"] as const;

export function CustomerEngagementControls({
  initialEngagement,
  locale
}: CustomerEngagementControlsProps) {
  const router = useRouter();
  const readOnlyPreview = isReadOnlyPreviewMode();
  const [engagement, setEngagement] = useState(initialEngagement);
  const [confirmationStatus, setConfirmationStatus] =
    useState<(typeof confirmationStatuses)[number]>("pending");
  const [confirmationSummary, setConfirmationSummary] = useState("");
  const [confirmationNotes, setConfirmationNotes] = useState("");
  const [confirmationNextStep, setConfirmationNextStep] = useState("");
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackDetails, setFeedbackDetails] = useState("");
  const [feedbackCategory, setFeedbackCategory] =
    useState<(typeof feedbackCategories)[number]>("field_feedback");
  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentSummary, setIncidentSummary] = useState("");
  const [incidentSeverity, setIncidentSeverity] =
    useState<(typeof incidentSeverities)[number]>("medium");
  const [error, setError] = useState("");
  const [pendingKey, setPendingKey] = useState("");

  useEffect(() => {
    setEngagement(initialEngagement);
    const confirmation = initialEngagement.customerConfirmation;
    setConfirmationStatus(confirmation?.status ?? "pending");
    setConfirmationSummary(
      confirmation?.summary ??
        (locale === "zh"
          ? "客户还没有提交正式确认。"
          : "The customer has not submitted a formal confirmation yet.")
    );
    setConfirmationNotes(
      confirmation?.notes ??
        (locale === "zh"
          ? "补充现场验证结果、是否可继续扩大部署，或者仍然存在的问题。"
          : "Add the field-validation result, whether the rollout can expand, or what still blocks acceptance.")
    );
    setConfirmationNextStep(confirmation?.nextStep ?? "");
  }, [initialEngagement, locale]);

  const t =
    locale === "zh"
      ? {
          eyebrow: "客户确认与反馈",
          title: "把已交付项目推进成真正的客户运营闭环",
          previewDisabled: "当前是只读预览，这些客户动作已禁用。",
          confirmationTitle: "客户确认",
          confirmationStatus: "确认状态",
          confirmationSummary: "确认摘要",
          confirmationNotes: "确认说明",
          confirmationNextStep: "下一步",
          confirmationSubmit: "保存客户确认",
          feedbackTitle: "提交现场反馈",
          feedbackName: "反馈标题",
          feedbackDetails: "反馈详情",
          feedbackCategory: "反馈类型",
          feedbackSubmit: "提交反馈",
          incidentTitle: "提交问题工单",
          incidentName: "问题标题",
          incidentSummary: "问题描述",
          incidentSeverity: "严重级别",
          incidentSubmit: "提交问题工单",
          failed: "操作失败"
        }
      : {
          eyebrow: "Customer confirmation and feedback",
          title: "Turn delivered work into a real customer-operations loop",
          previewDisabled: "Preview mode is read-only. Customer actions are disabled.",
          confirmationTitle: "Customer confirmation",
          confirmationStatus: "Confirmation status",
          confirmationSummary: "Summary",
          confirmationNotes: "Notes",
          confirmationNextStep: "Next step",
          confirmationSubmit: "Save customer confirmation",
          feedbackTitle: "Submit field feedback",
          feedbackName: "Feedback title",
          feedbackDetails: "Feedback details",
          feedbackCategory: "Feedback type",
          feedbackSubmit: "Submit feedback",
          incidentTitle: "Open incident ticket",
          incidentName: "Incident title",
          incidentSummary: "Incident summary",
          incidentSeverity: "Severity",
          incidentSubmit: "Open incident ticket",
          failed: "Operation failed"
        };

  async function syncEngagement(
    response: Response,
    fallbackError: string,
    onSuccess?: (item: EngagementDetail) => void
  ) {
    const payload = (await response.json()) as { item?: unknown; error?: string };
    const parsedItem = EngagementDetailSchema.safeParse(payload.item);

    if (!response.ok || !parsedItem.success) {
      throw new Error(payload.error ?? fallbackError);
    }

    setEngagement(parsedItem.data);
    onSuccess?.(parsedItem.data);
    startTransition(() => {
      router.refresh();
    });
  }

  async function submitConfirmation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingKey("confirmation");

    const parsed = CustomerConfirmationInputSchema.safeParse({
      status: confirmationStatus,
      summary: confirmationSummary,
      notes: confirmationNotes,
      nextStep: confirmationNextStep
    });

    if (!parsed.success) {
      setError(t.failed);
      setPendingKey("");
      return;
    }

    try {
      const response = await fetch(
        `${browserApiBasePath}/engagements/${engagement.id}/customer-confirmation`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(parsed.data)
        }
      );

      await syncEngagement(response, t.failed, (item) => {
        setConfirmationStatus(item.customerConfirmation?.status ?? "pending");
        setConfirmationSummary(item.customerConfirmation?.summary ?? "");
        setConfirmationNotes(item.customerConfirmation?.notes ?? "");
        setConfirmationNextStep(item.customerConfirmation?.nextStep ?? "");
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.failed);
    } finally {
      setPendingKey("");
    }
  }

  async function submitFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingKey("feedback");

    const parsed = EngagementFeedbackInputSchema.safeParse({
      title: feedbackTitle,
      details: feedbackDetails,
      category: feedbackCategory
    });

    if (!parsed.success) {
      setError(t.failed);
      setPendingKey("");
      return;
    }

    try {
      const response = await fetch(
        `${browserApiBasePath}/engagements/${engagement.id}/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(parsed.data)
        }
      );

      await syncEngagement(response, t.failed, () => {
        setFeedbackTitle("");
        setFeedbackDetails("");
        setFeedbackCategory("field_feedback");
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.failed);
    } finally {
      setPendingKey("");
    }
  }

  async function submitIncident(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingKey("incident");

    const parsed = EngagementIncidentInputSchema.safeParse({
      title: incidentTitle,
      summary: incidentSummary,
      severity: incidentSeverity
    });

    if (!parsed.success) {
      setError(t.failed);
      setPendingKey("");
      return;
    }

    try {
      const response = await fetch(
        `${browserApiBasePath}/engagements/${engagement.id}/incidents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(parsed.data)
        }
      );

      await syncEngagement(response, t.failed, () => {
        setIncidentTitle("");
        setIncidentSummary("");
        setIncidentSeverity("medium");
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.failed);
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
        <form className="form" onSubmit={submitConfirmation}>
          <h3>{t.confirmationTitle}</h3>
          <label>
            <span>{t.confirmationStatus}</span>
            <select
              value={confirmationStatus}
              onChange={(event) =>
                setConfirmationStatus(
                  event.target.value as (typeof confirmationStatuses)[number]
                )
              }
              disabled={readOnlyPreview}
            >
              {confirmationStatuses.map((status) => (
                <option key={status} value={status}>
                  {humanizeToken(status, locale)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t.confirmationSummary}</span>
            <input
              value={confirmationSummary}
              onChange={(event) => setConfirmationSummary(event.target.value)}
              disabled={readOnlyPreview}
            />
          </label>
          <label>
            <span>{t.confirmationNotes}</span>
            <textarea
              value={confirmationNotes}
              onChange={(event) => setConfirmationNotes(event.target.value)}
              rows={4}
              disabled={readOnlyPreview}
            />
          </label>
          <label>
            <span>{t.confirmationNextStep}</span>
            <input
              value={confirmationNextStep}
              onChange={(event) => setConfirmationNextStep(event.target.value)}
              disabled={readOnlyPreview}
            />
          </label>
          <button type="submit" disabled={readOnlyPreview || pendingKey === "confirmation"}>
            {t.confirmationSubmit}
          </button>
        </form>

        <form className="form" onSubmit={submitFeedback}>
          <h3>{t.feedbackTitle}</h3>
          <label>
            <span>{t.feedbackName}</span>
            <input
              value={feedbackTitle}
              onChange={(event) => setFeedbackTitle(event.target.value)}
              disabled={readOnlyPreview}
            />
          </label>
          <label>
            <span>{t.feedbackDetails}</span>
            <textarea
              value={feedbackDetails}
              onChange={(event) => setFeedbackDetails(event.target.value)}
              rows={4}
              disabled={readOnlyPreview}
            />
          </label>
          <label>
            <span>{t.feedbackCategory}</span>
            <select
              value={feedbackCategory}
              onChange={(event) =>
                setFeedbackCategory(
                  event.target.value as (typeof feedbackCategories)[number]
                )
              }
              disabled={readOnlyPreview}
            >
              {feedbackCategories.map((category) => (
                <option key={category} value={category}>
                  {humanizeToken(category, locale)}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={readOnlyPreview || pendingKey === "feedback"}>
            {t.feedbackSubmit}
          </button>
        </form>

        <form className="form" onSubmit={submitIncident}>
          <h3>{t.incidentTitle}</h3>
          <label>
            <span>{t.incidentName}</span>
            <input
              value={incidentTitle}
              onChange={(event) => setIncidentTitle(event.target.value)}
              disabled={readOnlyPreview}
            />
          </label>
          <label>
            <span>{t.incidentSummary}</span>
            <textarea
              value={incidentSummary}
              onChange={(event) => setIncidentSummary(event.target.value)}
              rows={4}
              disabled={readOnlyPreview}
            />
          </label>
          <label>
            <span>{t.incidentSeverity}</span>
            <select
              value={incidentSeverity}
              onChange={(event) =>
                setIncidentSeverity(
                  event.target.value as (typeof incidentSeverities)[number]
                )
              }
              disabled={readOnlyPreview}
            >
              {incidentSeverities.map((severity) => (
                <option key={severity} value={severity}>
                  {humanizeToken(severity, locale)}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={readOnlyPreview || pendingKey === "incident"}>
            {t.incidentSubmit}
          </button>
        </form>
      </div>
    </section>
  );
}
