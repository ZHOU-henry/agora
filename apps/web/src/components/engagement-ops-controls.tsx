"use client";

import { startTransition, useEffect, useState } from "react";
import {
  EngagementAgreementInputSchema,
  EngagementDeliverableStatusUpdateInputSchema,
  EngagementDeliverableInputSchema,
  EngagementDetailSchema,
  EngagementMilestoneInputSchema,
  EngagementReviewInputSchema,
  EngagementStatusUpdateInputSchema,
  type EngagementDetail
} from "@agora/shared/domain";
import { useRouter } from "next/navigation";
import { browserApiBasePath } from "../lib/api";
import type { Locale } from "../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../lib/presenters";
import { isReadOnlyPreviewMode } from "../lib/runtime";

type EngagementOpsControlsProps = {
  initialEngagement: EngagementDetail;
  locale: Locale;
};

const engagementStatuses = ["kickoff", "scoping", "building", "review", "delivered"] as const;
const deliverableStatuses = ["planned", "in_progress", "in_review", "approved", "needs_work"] as const;
const reviewVerdicts = ["approved", "needs_work"] as const;

export function EngagementOpsControls({
  initialEngagement,
  locale
}: EngagementOpsControlsProps) {
  const router = useRouter();
  const readOnlyPreview = isReadOnlyPreviewMode();
  const [engagement, setEngagement] = useState(initialEngagement);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewVerdict, setReviewVerdict] = useState<(typeof reviewVerdicts)[number]>("approved");
  const [reviewDeliverableId, setReviewDeliverableId] = useState("");
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneSummary, setMilestoneSummary] = useState("");
  const [milestoneDueLabel, setMilestoneDueLabel] = useState("");
  const [deliverableTitle, setDeliverableTitle] = useState("");
  const [deliverableSummary, setDeliverableSummary] = useState("");
  const [deliverableType, setDeliverableType] = useState("");
  const [agreementStatus, setAgreementStatus] = useState<"draft" | "confirmed">(
    initialEngagement.agreement?.status ?? "draft"
  );
  const [agreementMode, setAgreementMode] = useState(
    initialEngagement.agreement?.engagementMode ?? "pilot"
  );
  const [agreementBillingModel, setAgreementBillingModel] = useState(
    initialEngagement.agreement?.billingModel ?? ""
  );
  const [agreementBudgetLabel, setAgreementBudgetLabel] = useState(
    initialEngagement.agreement?.budgetLabel ?? ""
  );
  const [agreementStartWindow, setAgreementStartWindow] = useState(
    initialEngagement.agreement?.startWindow ?? ""
  );
  const [agreementNotes, setAgreementNotes] = useState(
    initialEngagement.agreement?.notes ?? ""
  );
  const [error, setError] = useState("");
  const [pendingKey, setPendingKey] = useState("");

  useEffect(() => {
    setEngagement(initialEngagement);
    setAgreementStatus(initialEngagement.agreement?.status ?? "draft");
    setAgreementMode(initialEngagement.agreement?.engagementMode ?? "pilot");
    setAgreementBillingModel(initialEngagement.agreement?.billingModel ?? "");
    setAgreementBudgetLabel(initialEngagement.agreement?.budgetLabel ?? "");
    setAgreementStartWindow(initialEngagement.agreement?.startWindow ?? "");
    setAgreementNotes(initialEngagement.agreement?.notes ?? "");
  }, [initialEngagement]);

  const t =
    locale === "zh"
      ? {
          eyebrow: "运营控制",
          title: "推进承接状态、交付物与审核",
          previewDisabled: "当前是受保护的交互模式才允许修改；只读模式下这些操作被禁用。",
          engagementStatus: "承接状态",
          milestoneTitle: "新增里程碑",
          milestoneName: "里程碑标题",
          milestoneSummary: "里程碑说明",
          milestoneDue: "目标时间",
          milestoneSubmit: "新增里程碑",
          deliverableTitle: "新增交付物",
          deliverableName: "交付物标题",
          deliverableSummary: "交付物说明",
          deliverableType: "交付物类型",
          deliverableSubmit: "新增交付物",
          agreementTitle: "商务确认",
          agreementStatus: "商务状态",
          agreementMode: "合作方式",
          agreementBilling: "计费方式",
          agreementBudget: "预算区间",
          agreementStart: "启动窗口",
          agreementNotes: "商务备注",
          agreementSubmit: "保存商务信息",
          reviewTitle: "提交审核记录",
          verdict: "审核结论",
          notes: "审核备注",
          notesPlaceholder: "写下这次审核为何通过或要求返工。",
          reviewTarget: "关联交付物",
          submitReview: "提交审核",
          failed: "操作失败"
        }
      : {
          eyebrow: "Operations",
          title: "Advance engagement, deliverables, and review",
          previewDisabled: "These actions are available only in protected interactive mode. They are disabled in read-only mode.",
          engagementStatus: "Engagement status",
          milestoneTitle: "Add milestone",
          milestoneName: "Milestone title",
          milestoneSummary: "Milestone summary",
          milestoneDue: "Target window",
          milestoneSubmit: "Add milestone",
          deliverableTitle: "Add deliverable",
          deliverableName: "Deliverable title",
          deliverableSummary: "Deliverable summary",
          deliverableType: "Artifact type",
          deliverableSubmit: "Add deliverable",
          agreementTitle: "Commercial frame",
          agreementStatus: "Commercial status",
          agreementMode: "Engagement mode",
          agreementBilling: "Billing model",
          agreementBudget: "Budget band",
          agreementStart: "Start window",
          agreementNotes: "Commercial notes",
          agreementSubmit: "Save commercial frame",
          reviewTitle: "Submit review log",
          verdict: "Verdict",
          notes: "Notes",
          notesPlaceholder: "Explain why this review approves or requests rework.",
          reviewTarget: "Linked deliverable",
          submitReview: "Submit review",
          failed: "Operation failed"
        };

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

      const payload = (await response.json()) as { item?: unknown; error?: string };
      const parsedItem = EngagementDetailSchema.safeParse(payload.item);

      if (!response.ok || !parsedItem.success) {
        throw new Error(payload.error ?? t.failed);
      }

      setEngagement(parsedItem.data);
      startTransition(() => {
        router.refresh();
      });
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

    const parsed = EngagementDeliverableStatusUpdateInputSchema.safeParse({ status });
    if (!parsed.success) {
      setError(t.failed);
      setPendingKey("");
      return;
    }

    try {
      const response = await fetch(
        `${browserApiBasePath}/engagement-deliverables/${deliverableId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(parsed.data)
        }
      );

      const payload = (await response.json()) as { item?: unknown; error?: string };
      const parsedItem = EngagementDetailSchema.safeParse(payload.item);

      if (!response.ok || !parsedItem.success) {
        throw new Error(payload.error ?? t.failed);
      }

      setEngagement(parsedItem.data);
      startTransition(() => {
        router.refresh();
      });
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : t.failed);
    } finally {
      setPendingKey("");
    }
  }

  async function submitMilestone(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingKey("milestone");

    const parsed = EngagementMilestoneInputSchema.safeParse({
      title: milestoneTitle,
      summary: milestoneSummary,
      dueLabel: milestoneDueLabel
    });

    if (!parsed.success) {
      setError(t.failed);
      setPendingKey("");
      return;
    }

    try {
      const response = await fetch(
        `${browserApiBasePath}/engagements/${engagement.id}/milestones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(parsed.data)
        }
      );

      const payload = (await response.json()) as { item?: unknown; error?: string };
      const parsedItem = EngagementDetailSchema.safeParse(payload.item);

      if (!response.ok || !parsedItem.success) {
        throw new Error(payload.error ?? t.failed);
      }

      setEngagement(parsedItem.data);
      setMilestoneTitle("");
      setMilestoneSummary("");
      setMilestoneDueLabel("");
      startTransition(() => {
        router.refresh();
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.failed);
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
    setPendingKey("deliverable:new");

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

      const payload = (await response.json()) as { item?: unknown; error?: string };
      const parsedItem = EngagementDetailSchema.safeParse(payload.item);

      if (!response.ok || !parsedItem.success) {
        throw new Error(payload.error ?? t.failed);
      }

      setEngagement(parsedItem.data);
      setDeliverableTitle("");
      setDeliverableSummary("");
      setDeliverableType("");
      startTransition(() => {
        router.refresh();
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.failed);
    } finally {
      setPendingKey("");
    }
  }

  async function submitAgreement(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingKey("agreement");

    const parsed = EngagementAgreementInputSchema.safeParse({
      status: agreementStatus,
      engagementMode: agreementMode,
      billingModel: agreementBillingModel,
      budgetLabel: agreementBudgetLabel,
      startWindow: agreementStartWindow,
      notes: agreementNotes
    });

    if (!parsed.success) {
      setError(t.failed);
      setPendingKey("");
      return;
    }

    try {
      const response = await fetch(
        `${browserApiBasePath}/engagements/${engagement.id}/agreement`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(parsed.data)
        }
      );

      const payload = (await response.json()) as { item?: unknown; error?: string };
      const parsedItem = EngagementDetailSchema.safeParse(payload.item);

      if (!response.ok || !parsedItem.success) {
        throw new Error(payload.error ?? t.failed);
      }

      setEngagement(parsedItem.data);
      startTransition(() => {
        router.refresh();
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.failed);
    } finally {
      setPendingKey("");
    }
  }

  async function submitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingKey("review");

    const parsed = EngagementReviewInputSchema.safeParse({
      verdict: reviewVerdict,
      notes: reviewNotes,
      deliverableId: reviewDeliverableId || null
    });

    if (!parsed.success) {
      setError(t.failed);
      setPendingKey("");
      return;
    }

    try {
      const response = await fetch(`${browserApiBasePath}/engagements/${engagement.id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsed.data)
      });

      const payload = (await response.json()) as { item?: unknown; error?: string };
      const parsedItem = EngagementDetailSchema.safeParse(payload.item);

      if (!response.ok || !parsedItem.success) {
        throw new Error(payload.error ?? t.failed);
      }

      setEngagement(parsedItem.data);
      setReviewNotes("");
      setReviewDeliverableId("");
      setReviewVerdict("approved");
      startTransition(() => {
        router.refresh();
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

      <div className="microstack">
        <p className="microeyebrow">{t.engagementStatus}</p>
        <div className="buttonrow">
          {engagementStatuses.map((status) => (
            <button
              key={status}
              type="button"
              disabled={pendingKey.length > 0}
              onClick={() => applyEngagementStatus(status)}
            >
              {humanizeToken(status, locale)}
            </button>
          ))}
        </div>
      </div>

      <div className="surface-grid surface-grid-two">
        <form className="form" onSubmit={submitMilestone}>
          <div className="sectionhead">
            <p className="eyebrow">{t.milestoneTitle}</p>
          </div>
          <label>
            <span>{t.milestoneName}</span>
            <input
              value={milestoneTitle}
              onChange={(event) => setMilestoneTitle(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.milestoneSummary}</span>
            <textarea
              value={milestoneSummary}
              onChange={(event) => setMilestoneSummary(event.target.value)}
              rows={3}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.milestoneDue}</span>
            <input
              value={milestoneDueLabel}
              onChange={(event) => setMilestoneDueLabel(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <button type="submit" disabled={pendingKey.length > 0}>
            {t.milestoneSubmit}
          </button>
        </form>

        <form className="form" onSubmit={submitDeliverable}>
          <div className="sectionhead">
            <p className="eyebrow">{t.deliverableTitle}</p>
          </div>
          <label>
            <span>{t.deliverableName}</span>
            <input
              value={deliverableTitle}
              onChange={(event) => setDeliverableTitle(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.deliverableSummary}</span>
            <textarea
              value={deliverableSummary}
              onChange={(event) => setDeliverableSummary(event.target.value)}
              rows={3}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.deliverableType}</span>
            <input
              value={deliverableType}
              onChange={(event) => setDeliverableType(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <button type="submit" disabled={pendingKey.length > 0}>
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
            <p className="tagline">{deliverable.artifactType}</p>
            <div className="buttonrow">
              {deliverableStatuses.map((status) => (
                <button
                  key={`${deliverable.id}-${status}`}
                  type="button"
                  disabled={pendingKey.length > 0}
                  onClick={() => applyDeliverableStatus(deliverable.id, status)}
                >
                  {humanizeToken(status, locale)}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>

      <form className="form" onSubmit={submitAgreement}>
        <div className="sectionhead">
          <p className="eyebrow">{t.agreementTitle}</p>
        </div>
        <div className="surface-grid surface-grid-two">
          <label>
            <span>{t.agreementStatus}</span>
            <select
              value={agreementStatus}
              onChange={(event) =>
                setAgreementStatus(event.target.value as "draft" | "confirmed")
              }
              disabled={pendingKey.length > 0}
            >
              <option value="draft">{humanizeToken("draft", locale)}</option>
              <option value="confirmed">{humanizeToken("confirmed", locale)}</option>
            </select>
          </label>
          <label>
            <span>{t.agreementMode}</span>
            <input
              value={agreementMode}
              onChange={(event) => setAgreementMode(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.agreementBilling}</span>
            <input
              value={agreementBillingModel}
              onChange={(event) => setAgreementBillingModel(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.agreementBudget}</span>
            <input
              value={agreementBudgetLabel}
              onChange={(event) => setAgreementBudgetLabel(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
          <label>
            <span>{t.agreementStart}</span>
            <input
              value={agreementStartWindow}
              onChange={(event) => setAgreementStartWindow(event.target.value)}
              disabled={pendingKey.length > 0}
            />
          </label>
        </div>
        <label>
          <span>{t.agreementNotes}</span>
          <textarea
            value={agreementNotes}
            onChange={(event) => setAgreementNotes(event.target.value)}
            rows={4}
            disabled={pendingKey.length > 0}
          />
        </label>
        <button type="submit" disabled={pendingKey.length > 0}>
          {t.agreementSubmit}
        </button>
      </form>

      <form className="form" onSubmit={submitReview}>
        <div className="sectionhead">
          <p className="eyebrow">{t.reviewTitle}</p>
        </div>
        <label>
          <span>{t.verdict}</span>
          <select
            value={reviewVerdict}
            onChange={(event) =>
              setReviewVerdict(event.target.value as (typeof reviewVerdicts)[number])
            }
          >
            {reviewVerdicts.map((verdict) => (
              <option key={verdict} value={verdict}>
                {humanizeToken(verdict, locale)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{t.reviewTarget}</span>
          <select
            value={reviewDeliverableId}
            onChange={(event) => setReviewDeliverableId(event.target.value)}
          >
            <option value="">-</option>
            {engagement.deliverables.map((deliverable) => (
              <option key={deliverable.id} value={deliverable.id}>
                {deliverable.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{t.notes}</span>
          <textarea
            value={reviewNotes}
            onChange={(event) => setReviewNotes(event.target.value)}
            rows={4}
            placeholder={t.notesPlaceholder}
          />
        </label>
        <button type="submit" disabled={pendingKey.length > 0}>
          {t.submitReview}
        </button>
      </form>

      <div className="timeline">
        {engagement.reviews.map((review) => (
          <article key={review.id} className="timelineitem">
            <div className="timelinehead">
              <p className="tagline">
                {locale === "zh" ? "审核记录" : "Review log"}
              </p>
              <span className={`statuspill ${toneClass(review.verdict)}`}>
                {humanizeToken(review.verdict, locale)}
              </span>
            </div>
            <p>{review.notes}</p>
            {review.deliverableId ? (
              <p className="tagline">
                {locale === "zh" ? "关联交付物" : "Deliverable"} / {review.deliverableId}
              </p>
            ) : null}
            <p className="timestamp">{formatTimestamp(review.createdAt, locale)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
