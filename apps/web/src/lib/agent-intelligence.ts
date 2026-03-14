import type { Locale } from "./locale";

export type CapabilityScore = {
  label: string;
  score: number;
};

export type AgentIntelligence = {
  idealFor: string[];
  avoidFor: string[];
  exampleTasks: string[];
  differentiators: string[];
  capabilityScores: CapabilityScore[];
};

const agentIntelligenceBySlug: Record<string, AgentIntelligence> = {
  athena: {
    idealFor: [
      "Portfolio prioritization across multiple workstreams",
      "Breaking ambiguous goals into phased execution plans",
      "Keeping teams aligned around milestones, sequencing, and risk"
    ],
    avoidFor: [
      "Deep code implementation with low-level detail",
      "Primary-source technical or market verification"
    ],
    exampleTasks: [
      "Turn three competing MVP directions into a six-week execution plan",
      "Find the sharpest dependency risks before we commit this roadmap",
      "Design the decision cadence for a five-agent product org"
    ],
    differentiators: [
      "Strong decomposition and sequencing bias",
      "Clear role boundaries between strategy and implementation",
      "Useful when the main problem is direction, not raw output"
    ],
    capabilityScores: [
      { label: "strategy", score: 95 },
      { label: "coordination", score: 92 },
      { label: "implementation", score: 48 },
      { label: "source rigor", score: 62 }
    ]
  },
  hermes: {
    idealFor: [
      "Source-backed product, market, and technical validation",
      "Comparative research when evidence quality matters",
      "Separating fact, signal, and inference before execution"
    ],
    avoidFor: [
      "Owning code delivery end-to-end",
      "Making final release or audit approvals"
    ],
    exampleTasks: [
      "Validate whether this user pain is real using official platform evidence",
      "Compare the current open-source landscape for agent orchestration",
      "Build a technical evidence brief before committing architecture"
    ],
    differentiators: [
      "High emphasis on dates, links, and primary sources",
      "Good at converting fuzzy claims into evidence-backed positions",
      "Useful when you need to know what is true before deciding what to build"
    ],
    capabilityScores: [
      { label: "research", score: 96 },
      { label: "source rigor", score: 95 },
      { label: "coordination", score: 70 },
      { label: "implementation", score: 38 }
    ]
  },
  hephaestus: {
    idealFor: [
      "Turning validated decisions into working code and tooling",
      "Building repeatable repo, CI, and runtime mechanics",
      "Executing scoped product slices with technical discipline"
    ],
    avoidFor: [
      "Self-approving risky launches without audit coverage",
      "Acting as the sole source of strategic direction"
    ],
    exampleTasks: [
      "Implement the next product slice and keep CI green",
      "Harden the local preview and database flow for operator demos",
      "Translate this validated domain model into working endpoints and UI"
    ],
    differentiators: [
      "High delivery velocity once scope is clear",
      "Strong bias toward executable structure over speculative abstractions",
      "Useful when the bottleneck is engineering throughput"
    ],
    capabilityScores: [
      { label: "implementation", score: 97 },
      { label: "delivery", score: 93 },
      { label: "strategy", score: 58 },
      { label: "governance", score: 61 }
    ]
  },
  themis: {
    idealFor: [
      "Reviewing completed runs before approval or reuse",
      "Finding quality, safety, or provenance gaps before release",
      "Acting as a formal challenge layer on risky delivery decisions"
    ],
    avoidFor: [
      "Owning first-pass product strategy or implementation work",
      "Replacing source-backed research when evidence still needs gathering"
    ],
    exampleTasks: [
      "Audit this run and decide whether it is safe to approve",
      "Find the weakest assumptions before we ship this workflow",
      "Review this implementation for provenance, quality, and regression risk"
    ],
    differentiators: [
      "Constructively adversarial instead of performatively negative",
      "Useful when the real need is judgment, not more output",
      "Designed to stop weak work from quietly becoming accepted truth"
    ],
    capabilityScores: [
      { label: "governance", score: 96 },
      { label: "review", score: 95 },
      { label: "source rigor", score: 84 },
      { label: "implementation", score: 42 }
    ]
  }
};

const agentIntelligenceZhBySlug: Record<string, AgentIntelligence> = {
  athena: {
    idealFor: [
      "多工作流并行时的优先级与取舍",
      "把模糊目标拆成阶段化执行计划",
      "围绕里程碑、节奏和风险保持项目对齐"
    ],
    avoidFor: ["深入的底层代码实现", "一手技术或市场信源核验"],
    exampleTasks: [
      "把三个竞争中的 MVP 方向收束成六周执行计划",
      "在我们承诺路线前找出最尖锐的依赖风险",
      "为一个五 Agent 产品组织设计决策节奏"
    ],
    differentiators: [
      "强拆解与强排序倾向",
      "策略层与实现层边界清晰",
      "当问题卡在方向而不是产出时最有价值"
    ],
    capabilityScores: [
      { label: "strategy", score: 95 },
      { label: "coordination", score: 92 },
      { label: "implementation", score: 48 },
      { label: "source rigor", score: 62 }
    ]
  },
  hermes: {
    idealFor: [
      "高信源要求的产品、市场与技术验证",
      "需要证据质量的对比研究",
      "在执行前先拆清事实、信号与推断"
    ],
    avoidFor: ["独自承担端到端代码交付", "做最终上线或审计放行"],
    exampleTasks: [
      "用官方平台证据验证这个用户痛点是否真实存在",
      "比较当前开源 Agent 编排生态的差异",
      "在架构承诺前先产出一份技术证据简报"
    ],
    differentiators: [
      "高度强调日期、链接和一手来源",
      "擅长把模糊判断变成证据化立场",
      "当你需要先搞清什么是真的时最有价值"
    ],
    capabilityScores: [
      { label: "research", score: 96 },
      { label: "source rigor", score: 95 },
      { label: "coordination", score: 70 },
      { label: "implementation", score: 38 }
    ]
  },
  hephaestus: {
    idealFor: [
      "把已验证决策落成工作代码和工具链",
      "构建可重复的 repo、CI 与运行机制",
      "在明确范围内推进产品切片交付"
    ],
    avoidFor: ["高风险上线时自我审批", "独自承担顶层战略方向"],
    exampleTasks: [
      "实现下一段产品切片并保持 CI 绿色",
      "加固本地预览与数据库流程用于演示",
      "把已验证的领域模型翻译成接口与界面"
    ],
    differentiators: [
      "范围明确后交付速度高",
      "更偏执行结构，而不是空泛抽象",
      "当瓶颈在工程推进时最有价值"
    ],
    capabilityScores: [
      { label: "implementation", score: 97 },
      { label: "delivery", score: 93 },
      { label: "strategy", score: 58 },
      { label: "governance", score: 61 }
    ]
  },
  themis: {
    idealFor: [
      "在批准或复用前审核已完成运行",
      "在上线前找出质量、安全或来源缺口",
      "作为高风险交付决策的正式挑战层"
    ],
    avoidFor: ["承担第一轮产品方向或原始实现", "在信源还没补齐时替代研究工作"],
    exampleTasks: [
      "审计这次运行并判断是否可以通过",
      "在我们上线前找出最脆弱的假设",
      "审查这次实现的来源、质量与回归风险"
    ],
    differentiators: [
      "建设性对抗，而不是表演式否定",
      "当真正需要的是判断而不是更多产出时最有价值",
      "目标是阻止弱工作悄悄变成默认标准"
    ],
    capabilityScores: [
      { label: "governance", score: 96 },
      { label: "review", score: 95 },
      { label: "source rigor", score: 84 },
      { label: "implementation", score: 42 }
    ]
  }
};

export function getAgentIntelligence(slug: string, locale: Locale = "en") {
  const source = locale === "zh" ? agentIntelligenceZhBySlug : agentIntelligenceBySlug;
  return source[slug] ?? null;
}
