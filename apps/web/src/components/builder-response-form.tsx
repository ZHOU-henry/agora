"use client";

import { startTransition, useEffect, useState } from "react";
import {
  DemandResponseInputSchema,
  TaskRequestDetailSchema,
  type ProviderProfile,
  type TaskRequestDetail
} from "@agora/shared/domain";
import { useRouter } from "next/navigation";
import { browserApiBasePath } from "../lib/api";
import type { Locale } from "../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../lib/presenters";
import { isReadOnlyPreviewMode } from "../lib/runtime";

type BuilderResponseFormProps = {
  initialRequest: TaskRequestDetail;
  providers: ProviderProfile[];
  locale: Locale;
};

export function BuilderResponseForm({
  initialRequest,
  providers,
  locale
}: BuilderResponseFormProps) {
  const router = useRouter();
  const readOnlyPreview = isReadOnlyPreviewMode();
  const [request, setRequest] = useState(initialRequest);
  const [providerId, setProviderId] = useState(providers[0]?.id ?? "");
  const [headline, setHeadline] = useState("");
  const [proposalSummary, setProposalSummary] = useState("");
  const [deliveryApproach, setDeliveryApproach] = useState("");
  const [etaLabel, setEtaLabel] = useState("");
  const [confidence, setConfidence] = useState<"high" | "medium" | "low">("medium");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setRequest(initialRequest);
  }, [initialRequest]);

  const t = locale === "zh"
    ? {
        eyebrow: "开发者响应",
        title: "向这条需求提交承接方案",
        previewDisabled: "当前是只读预览，开发者响应提交已关闭。",
        provider: "开发者",
        headline: "响应标题",
        summary: "方案摘要",
        approach: "交付方式",
        eta: "预计周期",
        confidence: "把握度",
        submit: "提交响应",
        submitting: "提交中...",
        invalid: "请补全开发者响应内容。",
        failed: "响应提交失败",
        latest: "当前响应列表",
        empty: "目前还没有开发者对这条需求提交响应。",
        readOnly: "只读预览",
        createdAt: "提交于"
      }
    : {
        eyebrow: "Builder Response",
        title: "Submit a builder-side response to this demand",
        previewDisabled: "Preview mode is active. Builder responses are disabled.",
        provider: "Builder",
        headline: "Response headline",
        summary: "Proposal summary",
        approach: "Delivery approach",
        eta: "Estimated timeline",
        confidence: "Confidence",
        submit: "Submit response",
        submitting: "Submitting...",
        invalid: "Please complete the response fields clearly.",
        failed: "Builder response failed",
        latest: "Current responses",
        empty: "No builders have responded to this demand yet.",
        readOnly: "Read-only preview",
        createdAt: "Created at"
      };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setIsSubmitting(true);

    const parsed = DemandResponseInputSchema.safeParse({
      providerId,
      headline,
      proposalSummary,
      deliveryApproach,
      etaLabel,
      confidence
    });

    if (!parsed.success) {
      setError(t.invalid);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${browserApiBasePath}/task-requests/${request.id}/responses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(parsed.data)
        }
      );

      const payload = (await response.json()) as {
        item?: unknown;
        error?: string;
      };

      const parsedItem = TaskRequestDetailSchema.safeParse(payload.item);

      if (!response.ok || !parsedItem.success) {
        throw new Error(payload.error ?? t.failed);
      }

      setRequest(parsedItem.data);
      setHeadline("");
      setProposalSummary("");
      setDeliveryApproach("");
      setEtaLabel("");
      setConfidence("medium");
      startTransition(() => {
        router.refresh();
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.failed);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <div className="sectionhead">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2>{t.title}</h2>
      </div>
      {readOnlyPreview ? <p className="small">{t.previewDisabled}</p> : null}
      <form className="form" onSubmit={handleSubmit}>
        <label>
          <span>{t.provider}</span>
          <select
            value={providerId}
            onChange={(event) => setProviderId(event.target.value)}
            disabled={readOnlyPreview}
          >
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>{t.headline}</span>
          <input
            value={headline}
            onChange={(event) => setHeadline(event.target.value)}
            placeholder={locale === "zh" ? "例如：工业异常处理试点方案" : "Example: Pilot for industrial exception handling"}
            disabled={readOnlyPreview}
          />
        </label>

        <label>
          <span>{t.summary}</span>
          <textarea
            value={proposalSummary}
            onChange={(event) => setProposalSummary(event.target.value)}
            rows={4}
            placeholder={locale === "zh" ? "说明你准备如何承接这条需求。" : "Explain how this builder would approach the demand."}
            disabled={readOnlyPreview}
          />
        </label>

        <label>
          <span>{t.approach}</span>
          <textarea
            value={deliveryApproach}
            onChange={(event) => setDeliveryApproach(event.target.value)}
            rows={3}
            placeholder={locale === "zh" ? "写出试点方式、交付范围或实施节奏。" : "Describe the pilot shape, scope, or rollout method."}
            disabled={readOnlyPreview}
          />
        </label>

        <div className="surface-grid surface-grid-two">
          <label>
            <span>{t.eta}</span>
            <input
              value={etaLabel}
              onChange={(event) => setEtaLabel(event.target.value)}
              placeholder={locale === "zh" ? "例如：2周试点" : "Example: 2-week pilot"}
              disabled={readOnlyPreview}
            />
          </label>

          <label>
            <span>{t.confidence}</span>
            <select
              value={confidence}
              onChange={(event) =>
                setConfidence(event.target.value as "high" | "medium" | "low")
              }
              disabled={readOnlyPreview}
            >
              <option value="high">{humanizeToken("high", locale)}</option>
              <option value="medium">{humanizeToken("medium", locale)}</option>
              <option value="low">{humanizeToken("low", locale)}</option>
            </select>
          </label>
        </div>

        <button type="submit" disabled={isSubmitting || readOnlyPreview}>
          {readOnlyPreview ? t.readOnly : isSubmitting ? t.submitting : t.submit}
        </button>
      </form>

      {error ? <p className="error">{error}</p> : null}

      <div className="microstack">
        <p className="microeyebrow">{t.latest}</p>
        <div className="timeline">
          {request.responses.length === 0 ? (
            <p>{t.empty}</p>
          ) : (
            request.responses.map((response) => (
              <article key={response.id} className="timelineitem">
                <div className="timelinehead">
                  <p className="tagline">{response.provider.name}</p>
                  <span className={`statuspill ${toneClass(response.status)}`}>
                    {humanizeToken(response.status, locale)}
                  </span>
                </div>
                <p>{response.headline}</p>
                <p>{response.proposalSummary}</p>
                {response.etaLabel ? (
                  <p className="tagline">
                    ETA / {response.etaLabel} / {humanizeToken(response.confidence, locale)}
                  </p>
                ) : null}
                <p className="timestamp">
                  {t.createdAt} {formatTimestamp(response.createdAt, locale)}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
