import type { Locale } from "./locale";

const formatterCache = new Map<Locale, Intl.DateTimeFormat>();

const tokenLabelsZh: Record<string, string> = {
  active: "已启用",
  draft: "草稿",
  submitted: "已提交",
  shortlisted: "已入围",
  accepted: "已接受",
  declined: "已拒绝",
  running: "运行中",
  completed: "已完成",
  failed: "失败",
  kickoff: "启动中",
  scoping: "范围定义",
  building: "构建中",
  delivered: "已交付",
  planned: "已规划",
  in_progress: "进行中",
  in_review: "审核中",
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
  manufacturing: "制造",
  industrial: "工业",
  quality: "质检",
  vision: "视觉",
  inspection: "检验",
  warehouse: "仓储",
  logistics: "物流",
  field: "现场",
  maintenance: "运维",
  operations: "运营",
  high: "高",
  medium: "中",
  low: "低",
  seeded: "种子供给",
  reviewed_external: "已审核外部来源",
  mixed: "混合来源",
  confirmed: "已确认",
  pending: "待确认",
  issues_reported: "已反馈问题",
  expansion_requested: "希望扩展",
  acknowledged: "已确认收到",
  resolved: "已解决",
  open: "待处理",
  investigating: "调查中",
  mitigated: "已缓解",
  critical: "严重",
  field_feedback: "现场反馈",
  environment_change: "环境变化",
  maintenance_request: "维护需求",
  expansion_signal: "扩展信号",
  stable: "稳定",
  watch: "观察中",
  blocked: "阻塞",
  expansion: "可扩展",
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
    case "completed":
    case "approved":
    case "accepted":
    case "confirmed":
    case "delivered":
    case "resolved":
    case "stable":
      return "tone-emerald";
    case "failed":
    case "rejected":
    case "declined":
    case "issues_reported":
    case "open":
    case "critical":
    case "blocked":
      return "tone-rose";
    case "submitted":
    case "needs_work":
    case "readonly":
    case "shortlisted":
    case "in_review":
    case "pending":
    case "watch":
      return "tone-amber";
    case "active":
    case "interactive":
    case "building":
    case "expansion_requested":
    case "expansion":
      return "tone-violet";
    case "running":
    case "kickoff":
    case "scoping":
    case "in_progress":
    case "acknowledged":
    case "investigating":
    case "mitigated":
      return "tone-cyan";
    default:
      return "tone-neutral";
  }
}
