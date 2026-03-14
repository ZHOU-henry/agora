"use client";

import { startTransition, useState } from "react";
import {
  DemandBoardPublishInputSchema,
  TaskRequestDetailSchema,
  type AgentDefinition,
  type TaskRequestDetail
} from "@agora/shared/domain";
import { useRouter } from "next/navigation";
import { browserApiBasePath } from "../lib/api";
import type { Locale } from "../lib/locale";
import { formatTimestamp, humanizeToken } from "../lib/presenters";
import { isReadOnlyPreviewMode } from "../lib/runtime";

type DemandIntakeFormProps = {
  agents: AgentDefinition[];
  locale: Locale;
};

export function DemandIntakeForm({
  agents,
  locale
}: DemandIntakeFormProps) {
  const router = useRouter();
  const readOnlyPreview = isReadOnlyPreviewMode();
  const [agentId, setAgentId] = useState(agents[0]?.id ?? "");
  const [requesterOrg, setRequesterOrg] = useState("");
  const [industry, setIndustry] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contextNote, setContextNote] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState<TaskRequestDetail | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t =
    locale === "zh"
      ? {
          eyebrow: "发布需求",
          title: "把客户需求直接发布到 Agora 的公开需求板",
          lede:
            "先把问题、行业和推荐方向说清楚，再让供给侧决定是否响应。这一层让平台从目录走向撮合。",
          previewDisabled: "当前是只读预览，需求发布已关闭。",
          agent: "推荐 Agent 方向",
          requesterOrg: "客户名称",
          industry: "行业场景",
          taskTitle: "需求标题",
          taskDescription: "需求描述",
          context: "补充上下文",
          requesterPlaceholder: "例如：苏州光学装配厂",
          industryPlaceholder: "例如：工业质检",
          titlePlaceholder: "例如：需要一个异常缺陷复盘 Agent",
          descriptionPlaceholder:
            "说明问题是什么、希望 Agent 帮到哪一步、当前团队为什么需要它。",
          contextPlaceholder:
            "补充流程背景、现有系统限制、试点边界或交付偏好。",
          submit: "发布到需求板",
          submitting: "发布中...",
          readOnly: "只读预览",
          invalid: "请完整填写客户、行业、需求标题和描述。",
          failed: "需求发布失败",
          successTitle: "需求已发布",
          successPrefix: "Agora 已创建需求对象",
          openRequest: "查看需求详情",
          openRun: "查看初始运行记录",
          createdAt: "发布时间"
        }
      : {
          eyebrow: "Publish Demand",
          title: "Publish a customer need directly into Agora's visible demand board",
          lede:
            "State the problem, industry context, and recommended agent direction clearly, then let the builder side decide whether to respond.",
          previewDisabled: "Preview mode is active. Demand publishing is disabled.",
          agent: "Recommended agent",
          requesterOrg: "Customer",
          industry: "Industry",
          taskTitle: "Demand title",
          taskDescription: "Demand description",
          context: "Extra context",
          requesterPlaceholder: "Example: Suzhou Optics Assembly",
          industryPlaceholder: "Example: Industrial quality",
          titlePlaceholder: "Example: Need an agent for recurring defect triage",
          descriptionPlaceholder:
            "Explain the problem, how far the agent should help, and why the team needs it now.",
          contextPlaceholder:
            "Add workflow constraints, pilot boundaries, current tooling, or delivery preferences.",
          submit: "Publish to board",
          submitting: "Publishing...",
          readOnly: "Read-only preview",
          invalid: "Please complete the customer, industry, title, and description clearly.",
          failed: "Demand publish failed",
          successTitle: "Demand published",
          successPrefix: "Agora created demand object",
          openRequest: "Open demand detail",
          openRun: "Open initial run",
          createdAt: "Published at"
        };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readOnlyPreview) {
      setError(t.previewDisabled);
      return;
    }

    setError("");
    setSubmitted(null);

    const parsed = DemandBoardPublishInputSchema.safeParse({
      agentId,
      requesterOrg,
      industry,
      title,
      description,
      contextNote
    });

    if (!parsed.success) {
      setError(t.invalid);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${browserApiBasePath}/demand-board`, {
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
        throw new Error(payload.error ?? t.failed);
      }

      setSubmitted(parsedItem.data);
      setRequesterOrg("");
      setIndustry("");
      setTitle("");
      setDescription("");
      setContextNote("");
      startTransition(() => {
        router.refresh();
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : t.failed
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="publish-demand" className="panel">
      <div className="sectionhead">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2>{t.title}</h2>
        <p className="lede small">{t.lede}</p>
      </div>
      {readOnlyPreview ? <p className="small">{t.previewDisabled}</p> : null}
      <form className="form" onSubmit={handleSubmit}>
        <label>
          <span>{t.agent}</span>
          <select
            value={agentId}
            onChange={(event) => setAgentId(event.target.value)}
            disabled={readOnlyPreview}
          >
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} / {agent.provider.name}
              </option>
            ))}
          </select>
        </label>

        <div className="surface-grid surface-grid-two">
          <label>
            <span>{t.requesterOrg}</span>
            <input
              value={requesterOrg}
              onChange={(event) => setRequesterOrg(event.target.value)}
              placeholder={t.requesterPlaceholder}
              disabled={readOnlyPreview}
            />
          </label>

          <label>
            <span>{t.industry}</span>
            <input
              value={industry}
              onChange={(event) => setIndustry(event.target.value)}
              placeholder={t.industryPlaceholder}
              disabled={readOnlyPreview}
            />
          </label>
        </div>

        <label>
          <span>{t.taskTitle}</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t.titlePlaceholder}
            disabled={readOnlyPreview}
          />
        </label>

        <label>
          <span>{t.taskDescription}</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            placeholder={t.descriptionPlaceholder}
            disabled={readOnlyPreview}
          />
        </label>

        <label>
          <span>{t.context}</span>
          <textarea
            value={contextNote}
            onChange={(event) => setContextNote(event.target.value)}
            rows={4}
            placeholder={t.contextPlaceholder}
            disabled={readOnlyPreview}
          />
        </label>

        <button type="submit" disabled={isSubmitting || readOnlyPreview}>
          {readOnlyPreview
            ? t.readOnly
            : isSubmitting
              ? t.submitting
              : t.submit}
        </button>
      </form>

      {error ? <p className="error">{error}</p> : null}

      {submitted ? (
        <div className="receipt">
          <h3>{t.successTitle}</h3>
          <p>
            {t.successPrefix} <span className="inlinecode">{submitted.id}</span>{" "}
            <strong>{humanizeToken(submitted.status, locale)}</strong>.
          </p>
          <p>
            <a className="cardlink" href={`/requests/${submitted.id}`}>
              {t.openRequest}
            </a>
          </p>
          {submitted.runs[0] ? (
            <p>
              <a className="cardlink" href={`/runs/${submitted.runs[0].id}`}>
                {t.openRun}
              </a>
            </p>
          ) : null}
          <p className="tagline">
            {t.createdAt} {formatTimestamp(submitted.createdAt, locale)}
          </p>
        </div>
      ) : null}
    </section>
  );
}
