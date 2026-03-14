import type {
  AgentDefinition,
  ProviderAgentReference,
  ProviderProfile,
  ProviderProfileDetail
} from "@agora/shared/domain";
import type { Locale } from "./locale";

const translatedTags: Record<string, string> = {
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
  "launch-cohort": "启动批次",
  operators: "运营方"
};

const providerZh: Record<
  string,
  Pick<ProviderProfile, "name" | "summary" | "description">
> = {
  "henry-first-party": {
    name: "Henry 第一方种子开发者",
    summary: "Agora 启动阶段的第一方开发者供给，用于验证平台供给侧与交付链路。",
    description:
      "这个开发者档案代表 Henry 自己的 Agent 能力与第一方供给，用于把 Agora 从概念推进到可以被客户和开发者同时理解的平台。"
  }
};

const agentZh: Record<
  string,
  Pick<
    AgentDefinition,
    | "name"
    | "summary"
    | "description"
    | "provenanceSummary"
    | "constraints"
    | "trustSignals"
  >
> = {
  athena: {
    name: "Athena",
    summary: "负责范围判断、优先级与执行节奏的项目控制型 Agent。",
    description:
      "Athena 帮助运营者把模糊目标拆成可执行阶段，避免项目在叙事里漂移却没有真实推进。",
    provenanceSummary:
      "由 Agora 团队根据内部项目控制角色和执行架构设计进行种子化整理。",
    constraints: [
      "适合处理优先级、拆解与阶段设计",
      "不适合作为低层实现工作的主执行面"
    ],
    trustSignals: ["角色边界清晰", "输出结构化", "偏 issue / milestone 驱动"]
  },
  hermes: {
    name: "Hermes",
    summary: "负责市场、产品与技术信源验证的研究型 Agent。",
    description:
      "Hermes 帮助运营者把市场判断、技术判断和产品判断建立在更可靠的来源和更清晰的不确定性标注之上。",
    provenanceSummary:
      "由 Agora 团队根据内部研究角色和信源纪律模型进行种子化整理。",
    constraints: ["适合信源质量要求高的工作", "不能替代真正的实现与交付"],
    trustSignals: ["信源驱动输出", "日期与链接明确", "事实和推断分层"]
  },
  hephaestus: {
    name: "Hephaestus",
    summary: "负责实现、脚手架与交付结构的工程型 Agent。",
    description:
      "Hephaestus 把已验证的方案转成工作代码、可复用工具链和更稳的系统结构。",
    provenanceSummary:
      "由 Agora 团队根据内部工程角色和实现工作流模型进行种子化整理。",
    constraints: ["适合范围和结构已相对清晰的构建任务", "不应在高风险场景中自我审核通过"],
    trustSignals: ["类型检查路径", "可复用的 repo 结构", "边界明确的实现风格"]
  },
  themis: {
    name: "Themis",
    summary: "负责质量把关、风险判断与审核门的审计型 Agent。",
    description:
      "Themis 帮助运营者审视结果质量、来源风险和交付边界，避免弱工作被默许为平台标准。",
    provenanceSummary:
      "由 Agora 团队根据内部审计角色、来源治理与审核工作流模型进行种子化整理。",
    constraints: ["适合审核、质检与交付风险判断", "不适合作为新方向探索或原始实现的第一负责人"],
    trustSignals: ["审核门显式存在", "建设性对抗姿态", "高度关注质量、风险与来源"]
  }
};

export function localizeProvider<T extends ProviderProfile | ProviderProfileDetail>(
  provider: T,
  locale: Locale
): T {
  if (locale === "en") {
    return provider;
  }

  const translated = providerZh[provider.slug];

  return {
    ...provider,
    name: translated?.name ?? provider.name,
    summary: translated?.summary ?? provider.summary,
    description: translated?.description ?? provider.description,
    tags: provider.tags.map((tag) => translatedTags[tag] ?? tag),
    ...("agents" in provider
      ? {
          agents: provider.agents.map((agent) => localizeAgentReference(agent, locale))
        }
      : {})
  };
}

export function localizeAgent<T extends AgentDefinition>(agent: T, locale: Locale): T {
  if (locale === "en") {
    return agent;
  }

  const translated = agentZh[agent.slug];

  return {
    ...agent,
    name: translated?.name ?? agent.name,
    summary: translated?.summary ?? agent.summary,
    description: translated?.description ?? agent.description,
    provenanceSummary: translated?.provenanceSummary ?? agent.provenanceSummary,
    constraints: translated?.constraints ?? agent.constraints,
    trustSignals: translated?.trustSignals ?? agent.trustSignals,
    tags: agent.tags.map((tag) => translatedTags[tag] ?? tag),
    provider: localizeProvider(agent.provider, locale)
  };
}

export function localizeAgentReference<T extends ProviderAgentReference>(
  agent: T,
  locale: Locale
): T {
  if (locale === "en") {
    return agent;
  }

  const translated = agentZh[agent.slug];

  return {
    ...agent,
    name: translated?.name ?? agent.name,
    summary: translated?.summary ?? agent.summary
  };
}
