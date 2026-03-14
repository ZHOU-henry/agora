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

export const agentIntelligenceBySlug: Record<string, AgentIntelligence> = {
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

export function getAgentIntelligence(slug: string) {
  return agentIntelligenceBySlug[slug] ?? null;
}
