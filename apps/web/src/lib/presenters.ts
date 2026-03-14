import type { Locale } from "./locale";

const formatterCache = new Map<Locale, Intl.DateTimeFormat>();

const tokenLabelsZh: Record<string, string> = {
  active: "已启用",
  draft: "草稿",
  submitted: "已提交",
  running: "运行中",
  completed: "已完成",
  failed: "失败",
  approved: "通过",
  needs_work: "需返工",
  rejected: "拒绝",
  readonly: "只读",
  interactive: "交互",
  first_party: "第一方",
  company: "公司",
  independent: "独立开发者",
  planning: "规划",
  strategy: "策略",
  portfolio: "组合管理",
  research: "研究",
  sources: "信源",
  analysis: "分析",
  code: "开发",
  delivery: "交付",
  systems: "系统",
  audit: "审核",
  review: "评审",
  governance: "治理",
  seeded: "种子供给",
  reviewed_external: "已审核外部来源",
  mixed: "混合来源",
  newest: "最新优先",
  oldest: "最早优先",
  "review-priority": "审核优先",
  event: "事件"
};

function getFormatter(locale: Locale) {
  const cached = formatterCache.get(locale);

  if (cached) {
    return cached;
  }

  const formatter = new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  formatterCache.set(locale, formatter);
  return formatter;
}

export function formatTimestamp(
  value: string | null | undefined,
  locale: Locale = "en"
) {
  if (!value) {
    return locale === "zh" ? "未记录" : "Not recorded";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return getFormatter(locale).format(date);
}

export function humanizeToken(value: string, locale: Locale = "en") {
  if (locale === "zh") {
    return tokenLabelsZh[value] ?? value.replaceAll("_", " ").replaceAll("-", " ");
  }

  return value.replaceAll("_", " ").replaceAll("-", " ");
}

export function titleizeToken(value: string, locale: Locale = "en") {
  const humanized = humanizeToken(value, locale);

  if (locale === "zh") {
    return humanized;
  }

  return humanized.charAt(0).toUpperCase() + humanized.slice(1);
}

export function toneClass(value: string | null | undefined) {
  switch (value) {
    case "running":
      return "tone-cyan";
    case "completed":
    case "approved":
      return "tone-emerald";
    case "failed":
    case "rejected":
      return "tone-rose";
    case "submitted":
    case "needs_work":
    case "readonly":
      return "tone-amber";
    case "active":
    case "interactive":
      return "tone-violet";
    default:
      return "tone-neutral";
  }
}
