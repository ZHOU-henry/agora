"use client";

import { startTransition, useEffect, useState } from "react";
import {
  DemandResponseStatusUpdateInputSchema,
  TaskRequestDetailSchema,
  type TaskRequestDetail
} from "@agora/shared/domain";
import { useRouter } from "next/navigation";
import { browserApiBasePath } from "../lib/api";
import type { Locale } from "../lib/locale";
import { formatTimestamp, humanizeToken, toneClass } from "../lib/presenters";
import { isReadOnlyPreviewMode } from "../lib/runtime";

type DemandResponseReviewProps = {
  initialRequest: TaskRequestDetail;
  locale: Locale;
};

const statuses = ["shortlisted", "accepted", "declined"] as const;

export function DemandResponseReview({
  initialRequest,
  locale
}: DemandResponseReviewProps) {
  const router = useRouter();
  const readOnlyPreview = isReadOnlyPreviewMode();
  const [request, setRequest] = useState(initialRequest);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState("");

  useEffect(() => {
    setRequest(initialRequest);
  }, [initialRequest]);

  const t =
    locale === "zh"
      ? {
          eyebrow: "响应决策",
          title: "筛选、接受或拒绝开发者响应",
          previewDisabled: "当前是只读预览，响应状态不能修改。",
          empty: "当前没有可评估的开发者响应。",
          statusLabel: "当前状态",
          createdAt: "提交于",
          eta: "预计周期",
          confidence: "把握度",
          action: (value: string) => {
            if (value === "shortlisted") return "加入候选";
            if (value === "accepted") return "接受";
            return "拒绝";
          },
          failed: "响应状态更新失败"
        }
      : {
          eyebrow: "Response Decisions",
          title: "Shortlist, accept, or decline builder responses",
          previewDisabled: "Preview mode is active. Response decisions are disabled.",
          empty: "No builder responses are available for review yet.",
          statusLabel: "Current status",
          createdAt: "Created at",
          eta: "ETA",
          confidence: "Confidence",
          action: (value: string) => {
            if (value === "shortlisted") return "Shortlist";
            if (value === "accepted") return "Accept";
            return "Decline";
          },
          failed: "Response status update failed"
        };

  async function applyStatus(responseId: string, status: (typeof statuses)[number]) {
    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setPendingId(responseId);

    const parsed = DemandResponseStatusUpdateInputSchema.safeParse({ status });

    if (!parsed.success) {
      setError(t.failed);
      setPendingId("");
      return;
    }

    try {
      const response = await fetch(`${browserApiBasePath}/demand-responses/${responseId}/status`, {
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

      const parsedItem = TaskRequestDetailSchema.safeParse(payload.item);

      if (!response.ok || !parsedItem.success) {
        throw new Error(payload.error ?? t.failed);
      }

      setRequest(parsedItem.data);
      startTransition(() => {
        router.refresh();
      });
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : t.failed);
    } finally {
      setPendingId("");
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
              <p className="tagline">
                {t.statusLabel} / {humanizeToken(response.status, locale)}
              </p>
              <p className="tagline">
                {t.eta} / {response.etaLabel || "-"} / {t.confidence} /{" "}
                {humanizeToken(response.confidence, locale)}
              </p>
              <p className="timestamp">
                {t.createdAt} {formatTimestamp(response.createdAt, locale)}
              </p>
              <div className="buttonrow">
                {statuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={readOnlyPreview || pendingId === response.id}
                    onClick={() => applyStatus(response.id, status)}
                  >
                    {t.action(status)}
                  </button>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
