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
  },
  "lingxi-factory-ai": {
    name: "灵析工厂智能",
    summary: "专注制造排产、工厂指挥和产线决策支持的工业 Agent 开发者。",
    description:
      "灵析工厂智能代表一种面向制造企业的开发者侧团队，把生产节奏、异常处理和班组协同封装为垂直 Agent 产品。"
  },
  "praxis-quality-lab": {
    name: "Praxis 质检实验室",
    summary: "聚焦工业视觉质检、追溯与缺陷复核工作流的 Builder 档案。",
    description:
      "Praxis 质检实验室代表把工业质检经验产品化的供给侧团队，目标是让工厂的图像检验与问题回传具备更好的速度和闭环。"
  },
  "relay-field-systems": {
    name: "Relay 现场系统",
    summary: "聚焦仓储、运维与一线流程增效的开发者侧团队。",
    description:
      "Relay 现场系统代表能够把仓储调度、现场维修和一线知识辅助做成 Agent 产品的实战型 Builder。"
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
  },
  "line-orchestrator": {
    name: "产线指挥官",
    summary: "面向生产节奏、排产冲突和异常协同的工厂 Agent 产品。",
    description:
      "产线指挥官帮助制造团队解释实时异常、推演计划影响，并在班次切换和现场指挥阶段形成更结构化的决策建议。",
    provenanceSummary:
      "种子化演示 Agent，用于模拟外部工业开发者在 Agora 平台上发布的垂直场景产品。",
    constraints: ["适合已有产线上下文的工厂场景", "不能替代真实控制系统和自动化 PLC 层"],
    trustSignals: ["强制造场景贴合", "面向运营人员的解释层", "围绕异常处理而不是通用聊天"]
  },
  "quality-sentinel": {
    name: "质检哨兵",
    summary: "面向缺陷分流、复核说明和问题升级的质检 Agent 产品。",
    description:
      "质检哨兵把工业视觉质检场景封装成更可交付的 Agent 工作流，帮助团队更快做缺陷归类、原因说明和升级判断。",
    provenanceSummary:
      "种子化演示 Agent，用于表示第三方工业质检 Builder 在平台上的供给能力。",
    constraints: ["适合已有图像或缺陷输入的场景", "在高监管行业中不能替代最终人工签核"],
    trustSignals: ["以检验流程为中心设计", "输出适合升级流转", "服务于追溯敏感团队"]
  },
  "warehouse-wave-planner": {
    name: "仓储波次规划官",
    summary: "面向波峰调度、库位压力与现场派工的仓储 Agent 产品。",
    description:
      "仓储波次规划官帮助物流团队理解吞吐波动、库位张力和短周期调度选择，让调度建议对现场主管更可解释。",
    provenanceSummary:
      "种子化演示 Agent，用于表示仓储运营方向的外部 Builder 在平台上的产品供给。",
    constraints: ["适合已有订单与仓内上下文的运营场景", "不能替代 WMS/TMS 等核心执行系统"],
    trustSignals: ["吞吐压力感知", "面向一线主管", "专注短周期运营决策"]
  },
  "maintenance-copilot": {
    name: "运维副驾",
    summary: "面向现场诊断、知识调取和工单闭环的维护 Agent 产品。",
    description:
      "运维副驾帮助一线团队更快调出相关知识、结构化诊断信息，并提高工单闭环记录的质量与速度。",
    provenanceSummary:
      "种子化演示 Agent，用于表示现场服务与运维 Builder 在平台上的产品供给。",
    constraints: ["适合已有设备上下文的维护场景", "高风险作业不能替代正式工程审批"],
    trustSignals: ["面向一线工作流", "帮助闭环记录", "围绕知识调取与记录质量设计"]
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
    ,
    ...("engagements" in provider
      ? {
          engagements: provider.engagements.map((engagement) => ({
            ...engagement,
            agent: localizeAgentReference(engagement.agent, locale)
          }))
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
