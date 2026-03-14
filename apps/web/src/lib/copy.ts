import type { Locale } from "./locale";

type NavItem = {
  href: string;
  label: string;
};

export type AppCopy = {
  header: {
    brandMeta: string;
    navItems: NavItem[];
    modeReadOnly: string;
    modeInteractive: string;
    localeLabel: string;
    localeOptions: Record<Locale, string>;
  };
  previewNotice: {
    title: string;
    body: string;
  };
  accessPage: {
    eyebrow: string;
    title: string;
    lede: string;
    panelKicker: string;
    modeLabel: string;
    modeValue: string;
    writesLabel: string;
    writesValue: string;
    mediaEyebrow: string;
    mediaTitle: string;
    mediaKicker: string;
    mediaCardTitle: string;
    mediaCaption: string;
  };
  accessGate: {
    eyebrow: string;
    title: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    unlockIdle: string;
    unlockBusy: string;
    accessDenied: string;
  };
  home: {
    eyebrow: string;
    title: string;
    lede: string;
    primaryAction: string;
    secondaryAction: string;
    heroChips: string[];
    pulse: {
      reviewLane: string;
      idle: string;
      live: string;
      supplyModel: string;
      catalogStatus: string;
      activeThreads: (count: number) => string;
      reviewQueue: (count: number) => string;
    };
    visual: {
      eyebrow: string;
      title: string;
      lede: string;
      cards: {
        hero: { kicker: string; title: string; caption: string };
        supply: { kicker: string; title: string; caption: string };
        cohort: { kicker: string; title: string; caption: string };
        execution: { kicker: string; title: string; caption: string };
      };
    };
    surfaces: {
      eyebrow: string;
      title: string;
      lede: string;
      cards: Array<{ title: string; description: string }>;
    };
    routing: {
      eyebrow: string;
      title: string;
      lede: string;
      searchLabel: string;
      searchPlaceholder: string;
      focusLabel: string;
      apply: string;
      focusFilters: Array<{ value: string; label: string }>;
    };
    providers: {
      eyebrow: string;
      title: string;
      lede: string;
      typeLabel: string;
      action: string;
    };
    agents: {
      eyebrow: string;
      title: string;
      lede: string;
      bestFit: string;
      builtBy: string;
      providerAction: string;
      action: string;
      empty: string;
    };
    comparison: {
      eyebrow: string;
      title: string;
      lede: string;
      primaryEdge: string;
      firstMove: string;
      fallback: string;
    };
    workstream: {
      eyebrow: string;
      title: string;
      lede: string;
      requestsTitle: string;
      requestsAction: string;
      noRequests: string;
      requestAction: string;
      reviewTitle: string;
      reviewLane: string;
      noReview: string;
      reviewAction: string;
      noSummary: string;
    };
    industries: {
      eyebrow: string;
      title: string;
      lede: string;
      cards: Array<{ kicker: string; title: string; caption: string; src: string }>;
    };
  };
  providersIndex: {
    eyebrow: string;
    title: string;
    lede: string;
    back: string;
    stats: {
      profiles: string;
      activeBuilders: string;
      supplyModel: string;
      launchMode: string;
      open: string;
      seeded: string;
    };
    visual: {
      eyebrow: string;
      title: string;
      cards: {
        network: { kicker: string; title: string; caption: string };
        industry: { kicker: string; title: string; caption: string };
      };
    };
    list: {
      eyebrow: string;
      title: string;
      lede: string;
      typeLabel: string;
      action: string;
    };
  };
  providerPage: {
    eyebrow: string;
    titlePrefix: string;
    back: string;
    visit: string;
    supplyPosture: string;
    publishedAgents: string;
    builderType: string;
    platformRole: string;
    platformRoleValue: string;
    visual: {
      eyebrow: string;
      title: string;
      network: { kicker: string; title: string; caption: string };
      execution: { kicker: string; title: string; caption: string };
    };
    agents: {
      eyebrow: string;
      title: string;
      lede: string;
      action: string;
    };
  };
  agentPage: {
    eyebrow: string;
    back: string;
    inspectBuilder: string;
    frame: string;
    trustSignals: string;
    constraints: string;
    tags: string;
    bestMove: string;
    concept: {
      eyebrow: string;
      title: string;
      role: { kicker: string; title: string; caption: string };
      loop: { kicker: string; title: string; caption: string };
    };
    builder: {
      eyebrow: string;
      title: string;
      visitSite: string;
      openProfile: string;
    };
    assurance: {
      eyebrow: string;
      title: string;
    };
    boundaries: {
      eyebrow: string;
      title: string;
    };
    fit: {
      eyebrow: string;
      title: string;
    };
    avoid: {
      eyebrow: string;
      title: string;
    };
    capability: {
      eyebrow: string;
      title: string;
      prompts: string;
    };
    provenance: {
      eyebrow: string;
      title: string;
      statusLabel: string;
    };
  };
  queue: {
    eyebrow: string;
    title: string;
    lede: string;
    back: string;
    telemetry: string;
    activeRuns: string;
    pendingReview: string;
    requestsTracked: string;
    visibleRuns: string;
    activeFilter: string;
    visual: {
      eyebrow: string;
      title: string;
      loop: { kicker: string; title: string; caption: string };
      deck: { kicker: string; title: string; caption: string };
    };
    filters: {
      eyebrow: string;
      title: string;
      items: Array<{ href: string; label: string; match: string }>;
    };
    review: {
      eyebrow: string;
      title: string;
      empty: string;
      action: string;
      noSummary: string;
    };
    active: {
      eyebrow: string;
      title: string;
      empty: string;
      action: string;
      noMessage: string;
    };
    requests: {
      eyebrow: string;
      title: string;
      empty: string;
      action: string;
    };
    builderBy: string;
  };
  requestPage: {
    eyebrow: string;
    backToAgent: string;
    inspectBuilder: string;
    state: string;
    runRecords: string;
    lastUpdate: string;
    provenance: string;
    builderType: string;
    visual: {
      eyebrow: string;
      title: string;
      request: { kicker: string; title: string; caption: string };
      market: { kicker: string; title: string; caption: string };
    };
    builder: {
      eyebrow: string;
      title: string;
      open: string;
    };
    context: {
      eyebrow: string;
      title: string;
      empty: string;
    };
    provenancePanel: {
      eyebrow: string;
      title: string;
    };
    execution: {
      eyebrow: string;
      title: string;
      action: string;
      noMessage: string;
      builderBy: string;
    };
  };
  runPage: {
    eyebrow: string;
    backToRequest: string;
    inspectBuilder: string;
    telemetry: string;
    created: string;
    lastUpdate: string;
    reviewState: string;
    reviewPending: string;
    builderType: string;
    visual: {
      eyebrow: string;
      title: string;
      reel: { kicker: string; title: string; caption: string };
      lane: { kicker: string; title: string; caption: string };
    };
    builder: {
      eyebrow: string;
      title: string;
      open: string;
    };
    outcome: {
      eyebrow: string;
      title: string;
      empty: string;
    };
    trace: {
      eyebrow: string;
      title: string;
    };
    provenance: {
      eyebrow: string;
      title: string;
    };
  };
  intakeForm: {
    eyebrow: string;
    title: (agentName: string) => string;
    lede: string;
    previewDisabled: string;
    seededPrompts: string;
    taskTitle: string;
    taskTitlePlaceholder: string;
    taskDescription: string;
    taskDescriptionPlaceholder: string;
    context: string;
    contextPlaceholder: string;
    submit: string;
    submitting: string;
    readOnly: string;
    invalid: string;
    failed: string;
    successTitle: string;
    successPrefix: string;
    openRun: string;
    createdAt: string;
  };
  runControls: {
    eyebrow: string;
    title: string;
    previewDisabled: string;
    currentStatus: string;
    statusMessage: string;
    statusMessagePlaceholder: string;
    resultSummary: string;
    resultSummaryPlaceholder: string;
    resultPayload: string;
    resultPayloadPlaceholder: string;
    invalidPayload: string;
    invalidUpdate: string;
    mark: (value: string) => string;
  };
  reviewForm: {
    eyebrow: string;
    title: string;
    previewDisabled: string;
    verdict: string;
    notes: string;
    notesPlaceholder: string;
    invalid: string;
    submit: string;
    submitting: string;
    readOnly: string;
    latest: string;
    verdictLabel: string;
    noNotes: string;
    reviewedAt: string;
  };
};

const copyByLocale: Record<Locale, AppCopy> = {
  zh: {
    header: {
      brandMeta: "Agent 开发、雇佣与交付平台",
      navItems: [
        { href: "/", label: "平台" },
        { href: "/providers", label: "开发者" },
        { href: "/queue", label: "执行台" }
      ],
      modeReadOnly: "预览 / 只读",
      modeInteractive: "本地 / 可写",
      localeLabel: "语言",
      localeOptions: {
        zh: "中文",
        en: "English"
      }
    },
    previewNotice: {
      title: "只读预览模式",
      body: "可浏览，不可提交任务、改运行状态或提交审核。UI 和 API 两层都已锁住。"
    },
    accessPage: {
      eyebrow: "受保护预览",
      title: "输入访问密码，进入只读版平台演示。",
      lede: "这个公开链接只展示平台能力，不开放任何写操作。",
      panelKicker: "预览边界",
      modeLabel: "模式",
      modeValue: "只读",
      writesLabel: "写操作",
      writesValue: "前端与 API 均已阻断",
      mediaEyebrow: "预览视觉",
      mediaTitle: "先让人看到平台世界，再让人读平台说明",
      mediaKicker: "受保护演示",
      mediaCardTitle: "受保护，但仍然需要足够有想象力",
      mediaCaption: "预览页不是纯登录壳。它应该先让客户和开发者感知到平台气质。"
    },
    accessGate: {
      eyebrow: "身份验证",
      title: "预览访问",
      passwordLabel: "密码",
      passwordPlaceholder: "输入预览访问密码",
      unlockIdle: "进入预览",
      unlockBusy: "验证中...",
      accessDenied: "访问被拒绝"
    },
    home: {
      eyebrow: "Agora // Agent 平台",
      title: "把客户需求、开发者供给与 Agent 交付放进同一个控制台。",
      lede: "面向中国与全球企业的 Agent 开发、雇佣与交易平台。当前从第一方种子供给起步，但目标是开放给外部 Agent 开发者与公司。",
      primaryAction: "查看执行台",
      secondaryAction: "查看开发者侧",
      heroChips: ["需求流转", "开发者供给", "交付可追踪", "审核在环"],
      pulse: {
        reviewLane: "审核队列",
        idle: "当前空闲，可接入新需求",
        live: "在线",
        supplyModel: "第一方起步，面向多开发者扩展",
        catalogStatus: "目录状态",
        activeThreads: (count) => `${count} 条运行中的执行线程`,
        reviewQueue: (count) => `${count} 条待审核运行`
      },
      visual: {
        eyebrow: "视觉叙事",
        title: "先把平台看明白，再决定要不要深入读文案",
        lede: "我们压缩文本密度，把想象空间交给更完整的可视化场景。",
        cards: {
          hero: {
            kicker: "平台主场景",
            title: "客户需求、开发者供给、路由与审核在一个画面里出现",
            caption: "平台第一屏就应该让客户意识到：这不是静态目录，而是一个运行中的 Agent 市场。"
          },
          supply: {
            kicker: "开发者侧",
            title: "不是一个人的私有 Agent 展板",
            caption: "平台必须自然留出外部 Agent 开发者与公司的入场空间。"
          },
          cohort: {
            kicker: "专家群像",
            title: "让 Agent 角色边界一眼可感知",
            caption: "比起长篇解释，视觉身份更快让客户理解不同 Agent lane 的差异。"
          },
          execution: {
            kicker: "执行流",
            title: "需求如何进入、运行、审核，一眼能懂",
            caption: "平台需要让传统行业客户看到“真实工作流”，而不是只看到概念词。"
          }
        }
      },
      surfaces: {
        eyebrow: "当前能力面",
        title: "Phase 1 的最小平台骨架",
        lede: "当前保持边界收敛，但每一层都为更完整的平台留接口。",
        cards: [
          { title: "需求入口", description: "收集客户问题、目标和上下文，形成可跟踪任务。" },
          { title: "Agent 目录", description: "展示能力边界、可信信号、适配场景与供给方。" },
          { title: "运行记录", description: "让任务状态、输出和轨迹都可追踪。" },
          { title: "审核闭环", description: "把批准、返工、拒绝纳入同一操作面。" }
        ]
      },
      routing: {
        eyebrow: "路由",
        title: "用更少文字，更快找到合适的能力",
        lede: "按任务意图和能力强项筛选，而不是靠猜。",
        searchLabel: "搜索目录",
        searchPlaceholder: "按场景、标签或示例任务搜索",
        focusLabel: "能力焦点",
        apply: "应用筛选",
        focusFilters: [
          { value: "all", label: "全部" },
          { value: "strategy", label: "策略" },
          { value: "research", label: "研究" },
          { value: "code", label: "开发" },
          { value: "sources", label: "信源严谨" },
          { value: "review", label: "审核" },
          { value: "governance", label: "治理" }
        ]
      },
      providers: {
        eyebrow: "开发者侧",
        title: "从第一方种子开发者开始，逐步走向开放供给",
        lede: "平台未来的增长，不只来自更多客户，也来自更多能交付垂直场景 Agent 的开发者。",
        typeLabel: "类型",
        action: "查看开发者"
      },
      agents: {
        eyebrow: "Agent 目录",
        title: "当前种子 Agent，未来开放给更多开发者供给",
        lede: "现在展示的是第一批供给方，不是平台供给侧的最终边界。",
        bestFit: "最适合",
        builtBy: "开发者",
        providerAction: "查看开发者",
        action: "查看 Agent",
        empty: "当前筛选条件下没有匹配 Agent。"
      },
      comparison: {
        eyebrow: "能力对照",
        title: "先判断是要策略、研究、开发还是审核",
        lede: "对照矩阵帮助客户先看清需求类型，再决定路由。",
        primaryEdge: "主能力",
        firstMove: "建议切入点",
        fallback: "暂无"
      },
      workstream: {
        eyebrow: "实时工作流",
        title: "最近的需求、运行和审核队列",
        lede: "这里是平台从“能看”走向“能跑”的关键区域。",
        requestsTitle: "最新需求",
        requestsAction: "查看执行台",
        noRequests: "还没有新的任务需求。",
        requestAction: "查看需求",
        reviewTitle: "待审核运行",
        reviewLane: "优先处理",
        noReview: "当前没有待审核运行。",
        reviewAction: "查看运行",
        noSummary: "尚未写入结果摘要。"
      },
      industries: {
        eyebrow: "行业场景",
        title: "让传统行业客户先被场景吸引，而不是被长文本拖住",
        lede: "制造、仓储、质检、现场服务，是 Agent 平台最容易被传统企业理解的切入面。",
        cards: [
          {
            kicker: "智能制造",
            title: "生产线调度、异常解释与班组协同",
            caption: "Agent 不只是回答问题，而是在工厂节奏里帮助调度、判断和记录。",
            src: "/media/factory-command-loop.svg"
          },
          {
            kicker: "工业质检",
            title: "视觉质检、缺陷复核与问题回传",
            caption: "把质检图像、异常原因与处理建议做成可交付的 Agent 工作流。",
            src: "/media/quality-vision-loop.svg"
          },
          {
            kicker: "仓储运营",
            title: "订单波峰调度、库位建议与班次指挥",
            caption: "传统仓储企业需要的不是空泛 AI，而是能看懂运营节奏的 Agent。",
            src: "/media/warehouse-orchestration-loop.svg"
          },
          {
            kicker: "现场运维",
            title: "设备维护辅助、知识检索与工单闭环",
            caption: "让一线工程师感受到 Agent 在真实作业场景里的增效，而不是 PPT 演示。",
            src: "/media/maintenance-copilot-loop.svg"
          }
        ]
      }
    },
    providersIndex: {
      eyebrow: "开发者目录",
      title: "面向多开发者供给的 Agent 平台入口",
      lede: "这里展示平台当前与未来的供给侧。现在从第一方开始，但目标是让更多 Agent 开发者进场。",
      back: "返回平台",
      stats: {
        profiles: "开发者档案",
        activeBuilders: "活跃开发者",
        supplyModel: "供给模型",
        launchMode: "启动方式",
        open: "开放扩展",
        seeded: "第一方种子"
      },
      visual: {
        eyebrow: "开发者侧视觉",
        title: "让开发者与客户都能直观理解供给侧形态",
        cards: {
          network: {
            kicker: "开发者网络",
            title: "需求板前面应该站着很多 Builder，不是一个人",
            caption: "客户看到的是可承接的供给，开发者看到的是可响应的需求。"
          },
          industry: {
            kicker: "行业落地",
            title: "供给侧需要贴近传统行业真实工作",
            caption: "开发者不是来发布抽象能力，而是来交付场景化 Agent 产品。"
          }
        }
      },
      list: {
        eyebrow: "当前供给方",
        title: "开发者档案",
        lede: "每个档案都应该说明其擅长的行业、能力和已发布 Agent。",
        typeLabel: "类型",
        action: "查看档案"
      }
    },
    providerPage: {
      eyebrow: "开发者档案",
      titlePrefix: "开发者",
      back: "返回平台",
      visit: "访问主页",
      supplyPosture: "供给姿态",
      publishedAgents: "已发布 Agent",
      builderType: "开发者类型",
      platformRole: "平台角色",
      platformRoleValue: "供给侧参与者",
      visual: {
        eyebrow: "开发者侧叙事",
        title: "让 Builder 看起来像平台的一部分，而不是附注",
        network: {
          kicker: "Builder 网络",
          title: "多开发者供给应该是一眼就能感受到的未来",
          caption: "就算现在供给侧还小，界面也要让人看到开放平台的走向。"
        },
        execution: {
          kicker: "交付路径",
          title: "Builder 的价值在于承接需求并完成交付",
          caption: "开发者页不应只是简介页，而应让人联想到需求承接、Agent 构建和审核通过。"
        }
      },
      agents: {
        eyebrow: "已发布 Agent",
        title: "当前供给结果",
        lede: "这里展示这个开发者当前在平台上的 Agent 供给。",
        action: "查看 Agent"
      }
    },
    agentPage: {
      eyebrow: "Agent 档案",
      back: "返回平台",
      inspectBuilder: "查看开发者",
      frame: "Agent 画像",
      trustSignals: "可信信号",
      constraints: "边界条件",
      tags: "标签",
      bestMove: "建议切入点",
      concept: {
        eyebrow: "概念影像",
        title: "在填写表单之前，先让角色气质站住",
        role: {
          kicker: "角色系统",
          title: "这个 Agent 属于更大的专家协作星系",
          caption: "用户应该先理解这个角色的定位，再决定是否把任务交给它。"
        },
        loop: {
          kicker: "执行环路",
          title: "不同 Agent，进入同一套可追踪交付框架",
          caption: "平台的稳定感来自统一执行框架，而不是来自堆很多说明。"
        }
      },
      builder: {
        eyebrow: "开发者",
        title: "供给侧所有者",
        visitSite: "访问主页",
        openProfile: "打开开发者档案"
      },
      assurance: {
        eyebrow: "可信性",
        title: "可信信号"
      },
      boundaries: {
        eyebrow: "边界",
        title: "不适合让它主导的工作"
      },
      fit: {
        eyebrow: "强项",
        title: "最适合承接什么"
      },
      avoid: {
        eyebrow: "误路由风险",
        title: "哪些任务应该由别的 Agent 牵头"
      },
      capability: {
        eyebrow: "能力剖面",
        title: "决策支持",
        prompts: "示例任务"
      },
      provenance: {
        eyebrow: "来源说明",
        title: "来源姿态",
        statusLabel: "状态"
      }
    },
    queue: {
      eyebrow: "执行台",
      title: "让需求、运行和审核在一个台面上流动。",
      lede: "这里是客户价值最容易被看见的地方：需求进入后到底发生了什么。",
      back: "返回平台",
      telemetry: "队列遥测",
      activeRuns: "运行中",
      pendingReview: "待审核",
      requestsTracked: "需求总数",
      visibleRuns: "可见运行",
      activeFilter: "当前筛选",
      visual: {
        eyebrow: "队列氛围",
        title: "先让队列有生命感，再让人阅读细项",
        loop: {
          kicker: "执行流",
          title: "队列不是列表，而是一台正在工作的机器",
          caption: "传统行业客户要看到“在跑”，而不是只看到数据库行。"
        },
        deck: {
          kicker: "操作台",
          title: "每条任务都属于更大的平台运行画面",
          caption: "更强的可视化会提升平台感，而不是让页面变成表格后台。"
        }
      },
      filters: {
        eyebrow: "筛选",
        title: "队列视图",
        items: [
          { href: "/queue", label: "全部", match: "all" },
          { href: "/queue?status=running", label: "运行中", match: "running" },
          { href: "/queue?status=completed", label: "已完成", match: "completed" },
          { href: "/queue?reviewState=pending", label: "待审核", match: "pending" },
          { href: "/queue?agentSlug=athena", label: "Athena", match: "athena" },
          {
            href: "/queue?sort=review-priority",
            label: "审核优先",
            match: "review-priority"
          }
        ]
      },
      review: {
        eyebrow: "审核优先",
        title: "待审核运行",
        empty: "当前没有待审核运行。",
        action: "查看运行",
        noSummary: "尚未写入结果摘要。"
      },
      active: {
        eyebrow: "实时执行",
        title: "运行中的任务",
        empty: "当前没有运行中的任务。",
        action: "打开运行",
        noMessage: "还没有最新状态说明。"
      },
      requests: {
        eyebrow: "需求入口",
        title: "最近需求",
        empty: "当前还没有新的需求。",
        action: "查看需求"
      },
      builderBy: "开发者"
    },
    requestPage: {
      eyebrow: "需求详情",
      backToAgent: "返回 Agent",
      inspectBuilder: "查看开发者",
      state: "请求状态",
      runRecords: "运行记录",
      lastUpdate: "最近更新",
      provenance: "来源",
      builderType: "开发者类型",
      visual: {
        eyebrow: "需求可视化",
        title: "让提出需求的人能想象接下来会发生什么",
        request: {
          kicker: "需求路径",
          title: "需求进入之后，不应停留在静态卡片",
          caption: "页面应该让客户感受到后续会进入路由、执行与审核。"
        },
        market: {
          kicker: "平台语境",
          title: "需求不是孤立存在，它属于更大的供给市场",
          caption: "这会让平台从“提交表单”变成“委托交付”的感觉。"
        }
      },
      builder: {
        eyebrow: "开发者",
        title: "供给侧所有者",
        open: "打开开发者档案"
      },
      context: {
        eyebrow: "上下文",
        title: "任务上下文",
        empty: "未提供额外上下文。"
      },
      provenancePanel: {
        eyebrow: "来源说明",
        title: "Agent 来源"
      },
      execution: {
        eyebrow: "执行",
        title: "运行记录",
        action: "查看运行",
        noMessage: "尚未记录状态说明。",
        builderBy: "开发者"
      }
    },
    runPage: {
      eyebrow: "运行记录",
      backToRequest: "返回需求",
      inspectBuilder: "查看开发者",
      telemetry: "运行遥测",
      created: "创建时间",
      lastUpdate: "最近更新",
      reviewState: "审核状态",
      reviewPending: "待审核",
      builderType: "开发者类型",
      visual: {
        eyebrow: "运行可视化",
        title: "让运行记录像真实的操作画面，而不是只是一段日志",
        reel: {
          kicker: "运行片段",
          title: "执行记录应该被看成一条可见的输送带",
          caption: "对客户和开发者来说，这比一堆日志更容易激发信任。"
        },
        lane: {
          kicker: "专家通道",
          title: "每条运行都属于一套专家协作系统",
          caption: "更强的角色感会让运行记录更有辨识度，也更像产品而不是后台。"
        }
      },
      builder: {
        eyebrow: "开发者",
        title: "供给侧所有者",
        open: "打开开发者档案"
      },
      outcome: {
        eyebrow: "结果",
        title: "执行结果",
        empty: "尚未记录结果摘要。"
      },
      trace: {
        eyebrow: "轨迹",
        title: "执行时间线"
      },
      provenance: {
        eyebrow: "来源说明",
        title: "Agent 来源"
      }
    },
    intakeForm: {
      eyebrow: "任务提交",
      title: (agentName) => `提交给 ${agentName} 的需求`,
      lede: "输入目标、期望结果与关键约束，把需求送进平台执行链路。",
      previewDisabled: "当前是只读预览，任务提交已关闭。",
      seededPrompts: "从示例需求开始",
      taskTitle: "任务标题",
      taskTitlePlaceholder: "例如：梳理工厂排产异常的主要风险",
      taskDescription: "任务说明",
      taskDescriptionPlaceholder: "说明目标、背景、希望看到的结果以及成功标准。",
      context: "补充上下文",
      contextPlaceholder: "补充项目背景、业务约束、行业信息或时效要求。",
      submit: "提交需求",
      submitting: "提交中...",
      readOnly: "只读预览",
      invalid: "请补全任务标题和任务说明。",
      failed: "任务提交失败",
      successTitle: "需求已提交",
      successPrefix: "请求",
      openRun: "查看运行记录",
      createdAt: "创建于"
    },
    runControls: {
      eyebrow: "控制",
      title: "运行控制",
      previewDisabled: "当前是只读预览，不能修改运行状态。",
      currentStatus: "当前状态",
      statusMessage: "状态说明",
      statusMessagePlaceholder: "补充一条运行状态说明",
      resultSummary: "结果摘要",
      resultSummaryPlaceholder: "用一两句写清这次运行的面向客户结果。",
      resultPayload: "结果负载（JSON）",
      resultPayloadPlaceholder: '{"summary":"任务完成","confidence":"high"}',
      invalidPayload: "结果负载必须是合法 JSON。",
      invalidUpdate: "状态更新无效。",
      mark: (value) => `标记为${value}`
    },
    reviewForm: {
      eyebrow: "审核",
      title: "运营审核",
      previewDisabled: "当前是只读预览，不能提交审核。",
      verdict: "审核结论",
      notes: "审核备注",
      notesPlaceholder: "写下通过、返工或拒绝的判断理由。",
      invalid: "审核输入无效。",
      submit: "提交审核",
      submitting: "提交中...",
      readOnly: "只读预览",
      latest: "最近一次审核",
      verdictLabel: "结论",
      noNotes: "没有记录审核备注。",
      reviewedAt: "审核于"
    }
  },
  en: {
    header: {
      brandMeta: "Agent Development, Hiring, and Delivery Platform",
      navItems: [
        { href: "/", label: "Platform" },
        { href: "/providers", label: "Builders" },
        { href: "/queue", label: "Queue" }
      ],
      modeReadOnly: "preview / read-only",
      modeInteractive: "local / writable",
      localeLabel: "Language",
      localeOptions: {
        zh: "中文",
        en: "English"
      }
    },
    previewNotice: {
      title: "Read-only preview mode",
      body: "Browsing stays open, but task submission, run status changes, and review actions are blocked in both UI and API."
    },
    accessPage: {
      eyebrow: "Protected Preview",
      title: "Enter the access key to open the read-only deck.",
      lede: "This public link exposes the platform experience without exposing any write path.",
      panelKicker: "Preview posture",
      modeLabel: "mode",
      modeValue: "read-only",
      writesLabel: "writes",
      writesValue: "blocked in both UI and API",
      mediaEyebrow: "Preview Visual",
      mediaTitle: "People should see the world before they read the system",
      mediaKicker: "Protected reel",
      mediaCardTitle: "Protected does not have to mean dull",
      mediaCaption: "The gate keeps the preview safe, but the visual layer should still communicate platform ambition immediately."
    },
    accessGate: {
      eyebrow: "Authentication",
      title: "Preview access",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter the preview password",
      unlockIdle: "Unlock preview",
      unlockBusy: "Unlocking...",
      accessDenied: "Access denied"
    },
    home: {
      eyebrow: "Agora // Agent Platform",
      title: "Put customer demand, builder supply, and agent delivery inside one operating surface.",
      lede: "An agent development, hiring, and transaction platform for Chinese and global enterprises. The current launch starts with first-party supply, but the direction is open to outside builders and agent companies.",
      primaryAction: "Open queue",
      secondaryAction: "See builders",
      heroChips: ["demand flow", "builder supply", "traceable delivery", "review in loop"],
      pulse: {
        reviewLane: "review lane",
        idle: "Idle and ready for new demand",
        live: "Live",
        supplyModel: "seeded first-party, open to many builders",
        catalogStatus: "catalog status",
        activeThreads: (count) => `${count} active execution threads`,
        reviewQueue: (count) => `${count} runs waiting for review`
      },
      visual: {
        eyebrow: "Visual Brief",
        title: "Show the platform before asking people to read it",
        lede: "We are reducing text density and giving more of the imagination space to visuals.",
        cards: {
          hero: {
            kicker: "Platform hero",
            title: "Demand, builders, routing, and review appear in one frame",
            caption: "The first screen should make it obvious that this is a live agent market, not a static directory."
          },
          supply: {
            kicker: "Supply side",
            title: "Not one person's private agent deck",
            caption: "The product needs to naturally leave room for outside agent developers and companies."
          },
          cohort: {
            kicker: "Specialist cohort",
            title: "Role boundaries should be legible at a glance",
            caption: "Visual identity helps customers understand specialist lanes faster than dense explanation."
          },
          execution: {
            kicker: "Execution flow",
            title: "Demand, run, and review should feel visible",
            caption: "Traditional-industry customers need to see a real work machine, not a wall of concepts."
          }
        }
      },
      surfaces: {
        eyebrow: "Current Surfaces",
        title: "The phase-1 platform spine",
        lede: "The boundary stays narrow for now, but each layer is designed to scale into a fuller platform.",
        cards: [
          { title: "Demand intake", description: "Capture customer problems, goals, and context as trackable work." },
          { title: "Agent catalog", description: "Expose boundaries, trust framing, fit, and supply ownership." },
          { title: "Run record", description: "Make state, payloads, and trace visible after execution starts." },
          { title: "Review loop", description: "Keep approval, rework, and rejection inside the same operating surface." }
        ]
      },
      routing: {
        eyebrow: "Routing",
        title: "Use less text to find the right lane faster",
        lede: "Filter by intent and strength instead of guessing.",
        searchLabel: "Search catalog",
        searchPlaceholder: "Search by scenario, tag, or example task",
        focusLabel: "Focus lane",
        apply: "Apply filter",
        focusFilters: [
          { value: "all", label: "all" },
          { value: "strategy", label: "strategy" },
          { value: "research", label: "research" },
          { value: "code", label: "implementation" },
          { value: "sources", label: "source rigor" },
          { value: "review", label: "review" },
          { value: "governance", label: "governance" }
        ]
      },
      providers: {
        eyebrow: "Supply Side",
        title: "Start with seeded first-party builders, expand toward open supply",
        lede: "Platform growth should come from more builders as much as from more customers.",
        typeLabel: "Type",
        action: "Inspect builder"
      },
      agents: {
        eyebrow: "Agent Catalog",
        title: "Seeded launch agents, built for a broader builder-side future",
        lede: "What you see now is the launch cohort, not the final limit of platform supply.",
        bestFit: "Best fit",
        builtBy: "Built by",
        providerAction: "View builder",
        action: "Inspect agent",
        empty: "No agents match the current filter."
      },
      comparison: {
        eyebrow: "Capability Matrix",
        title: "Decide whether the task needs strategy, research, implementation, or audit first",
        lede: "The matrix helps customers identify demand shape before routing work.",
        primaryEdge: "primary edge",
        firstMove: "first move",
        fallback: "n/a"
      },
      workstream: {
        eyebrow: "Live Workstream",
        title: "Recent demand, execution, and review traffic",
        lede: "This is where the platform stops being descriptive and starts feeling operational.",
        requestsTitle: "Recent demand",
        requestsAction: "Open queue",
        noRequests: "No new task requests yet.",
        requestAction: "Open request",
        reviewTitle: "Review-ready runs",
        reviewLane: "priority lane",
        noReview: "No runs waiting for review right now.",
        reviewAction: "Inspect run",
        noSummary: "No result summary yet."
      },
      industries: {
        eyebrow: "Industry Scenes",
        title: "Traditional industry customers should be pulled in by scenes, not dragged through copy",
        lede: "Manufacturing, warehousing, inspection, and field maintenance are strong first mental anchors for real agent products.",
        cards: [
          {
            kicker: "Smart manufacturing",
            title: "Production scheduling, exception analysis, and shift coordination",
            caption: "The promise is not abstract AI. It is agent support inside real factory tempo.",
            src: "/media/factory-command-loop.svg"
          },
          {
            kicker: "Industrial inspection",
            title: "Vision QA, defect review, and issue feedback loops",
            caption: "Turn image-heavy quality tasks into agent workflows that feel deliverable, not theoretical.",
            src: "/media/quality-vision-loop.svg"
          },
          {
            kicker: "Warehouse operations",
            title: "Order surge orchestration, slotting, and shift dispatch",
            caption: "Traditional operations teams need agents that understand throughput pressure, not just chat prompts.",
            src: "/media/warehouse-orchestration-loop.svg"
          },
          {
            kicker: "Field maintenance",
            title: "Equipment support, knowledge retrieval, and work-order closure",
            caption: "Show how agents can strengthen frontline work instead of just summarizing from a dashboard.",
            src: "/media/maintenance-copilot-loop.svg"
          }
        ]
      }
    },
    providersIndex: {
      eyebrow: "Builder Directory",
      title: "The supply-side entry point for a multi-builder agent platform",
      lede: "This surface represents the current and future builder side. It starts with first-party supply, but it is built for many builders.",
      back: "Back to platform",
      stats: {
        profiles: "builder profiles",
        activeBuilders: "active builders",
        supplyModel: "supply model",
        launchMode: "launch mode",
        open: "open expansion",
        seeded: "seeded first-party"
      },
      visual: {
        eyebrow: "Builder-side Visuals",
        title: "Customers and builders should instantly understand what supply looks like",
        cards: {
          network: {
            kicker: "Builder network",
            title: "A demand board should face many builders, not one person",
            caption: "Customers see supply to engage, and builders see demand to respond to."
          },
          industry: {
            kicker: "Industry delivery",
            title: "Supply-side work should feel close to real industrial operations",
            caption: "Builders are not here to publish abstract capabilities. They are here to ship scenario-specific agent products."
          }
        }
      },
      list: {
        eyebrow: "Current Builders",
        title: "Builder profiles",
        lede: "Each profile should explain domain fit, capability, and current published agents.",
        typeLabel: "Type",
        action: "Open profile"
      }
    },
    providerPage: {
      eyebrow: "Builder Profile",
      titlePrefix: "Builder",
      back: "Back to platform",
      visit: "Visit site",
      supplyPosture: "supply posture",
      publishedAgents: "published agents",
      builderType: "builder type",
      platformRole: "platform role",
      platformRoleValue: "supply-side participant",
      visual: {
        eyebrow: "Builder-side Narrative",
        title: "Builders should feel central to the product, not footnoted",
        network: {
          kicker: "Builder network",
          title: "Even a small supply side should still signal a multi-builder future",
          caption: "The UI needs to make the platform direction obvious before scale actually arrives."
        },
        execution: {
          kicker: "Delivery path",
          title: "A builder matters because it can absorb demand and deliver",
          caption: "A builder page should imply intake, construction, delivery, and review, not just profile copy."
        }
      },
      agents: {
        eyebrow: "Published Agents",
        title: "Current supply output",
        lede: "This surface shows the agents currently associated with this builder.",
        action: "Inspect agent"
      }
    },
    agentPage: {
      eyebrow: "Agent Profile",
      back: "Back to platform",
      inspectBuilder: "Inspect builder",
      frame: "Agent frame",
      trustSignals: "trust signals",
      constraints: "constraints",
      tags: "tags",
      bestMove: "best first move",
      concept: {
        eyebrow: "Concept Reel",
        title: "Let the role feel vivid before the forms begin",
        role: {
          kicker: "Role system",
          title: "This agent belongs to a larger specialist constellation",
          caption: "Users should understand role posture before deciding whether to route work here."
        },
        loop: {
          kicker: "Execution loop",
          title: "Different agents, one inspectable delivery frame",
          caption: "The platform feels stable because every specialist still lands inside one visible operational circuit."
        }
      },
      builder: {
        eyebrow: "Builder",
        title: "Supply-side owner",
        visitSite: "Visit site",
        openProfile: "Open builder profile"
      },
      assurance: {
        eyebrow: "Assurance",
        title: "Trust signals"
      },
      boundaries: {
        eyebrow: "Boundaries",
        title: "Where this agent should not lead"
      },
      fit: {
        eyebrow: "Best Fit",
        title: "Where this agent is strongest"
      },
      avoid: {
        eyebrow: "Avoid Misrouting",
        title: "Where another agent should lead"
      },
      capability: {
        eyebrow: "Capability Profile",
        title: "Decision support",
        prompts: "Example prompts"
      },
      provenance: {
        eyebrow: "Provenance",
        title: "Source posture",
        statusLabel: "Status"
      }
    },
    queue: {
      eyebrow: "Operator Queue",
      title: "Let demand, execution, and review move across one surface.",
      lede: "This is where customer value becomes most visible: what actually happens after demand enters the platform.",
      back: "Back to platform",
      telemetry: "queue telemetry",
      activeRuns: "active runs",
      pendingReview: "awaiting review",
      requestsTracked: "requests tracked",
      visibleRuns: "visible runs",
      activeFilter: "active filter",
      visual: {
        eyebrow: "Queue Atmosphere",
        title: "Make the queue feel alive before people parse the rows",
        loop: {
          kicker: "Execution loop",
          title: "The queue is a visible machine, not a static list",
          caption: "Traditional-industry customers need to see work in motion, not just database records."
        },
        deck: {
          kicker: "Operator deck",
          title: "Every queue card belongs to a larger operational scene",
          caption: "Stronger visualization raises the sense of platform depth without adding policy-heavy text."
        }
      },
      filters: {
        eyebrow: "Views",
        title: "Queue filters",
        items: [
          { href: "/queue", label: "all", match: "all" },
          { href: "/queue?status=running", label: "running", match: "running" },
          { href: "/queue?status=completed", label: "completed", match: "completed" },
          { href: "/queue?reviewState=pending", label: "awaiting review", match: "pending" },
          { href: "/queue?agentSlug=athena", label: "athena", match: "athena" },
          { href: "/queue?sort=review-priority", label: "review priority", match: "review-priority" }
        ]
      },
      review: {
        eyebrow: "Priority Lane",
        title: "Review queue",
        empty: "No runs are waiting for review right now.",
        action: "Review run",
        noSummary: "No result summary yet."
      },
      active: {
        eyebrow: "Live Threads",
        title: "Active runs",
        empty: "No active runs right now.",
        action: "Open run record",
        noMessage: "No latest message yet."
      },
      requests: {
        eyebrow: "Demand",
        title: "Recent requests",
        empty: "No requests have been captured yet.",
        action: "Open task request"
      },
      builderBy: "builder"
    },
    requestPage: {
      eyebrow: "Task Request",
      backToAgent: "Back to agent",
      inspectBuilder: "Inspect builder",
      state: "request state",
      runRecords: "run records",
      lastUpdate: "last update",
      provenance: "provenance",
      builderType: "builder type",
      visual: {
        eyebrow: "Request Visualization",
        title: "Help the requester imagine what happens next",
        request: {
          kicker: "Request path",
          title: "A request should imply downstream motion",
          caption: "The page should make routing, execution, and review feel inevitable before the user opens a specific run."
        },
        market: {
          kicker: "Platform context",
          title: "Demand belongs inside a bigger supply-side market",
          caption: "That shift turns the experience from a form submission into a delivery marketplace."
        }
      },
      builder: {
        eyebrow: "Builder",
        title: "Supply-side owner",
        open: "Open builder profile"
      },
      context: {
        eyebrow: "Context",
        title: "Task context",
        empty: "No extra context provided."
      },
      provenancePanel: {
        eyebrow: "Provenance",
        title: "Agent provenance"
      },
      execution: {
        eyebrow: "Execution",
        title: "Run records",
        action: "Open run record",
        noMessage: "No message recorded yet.",
        builderBy: "builder"
      }
    },
    runPage: {
      eyebrow: "Run Record",
      backToRequest: "Back to task request",
      inspectBuilder: "Inspect builder",
      telemetry: "run telemetry",
      created: "created",
      lastUpdate: "last update",
      reviewState: "review state",
      reviewPending: "Pending",
      builderType: "builder type",
      visual: {
        eyebrow: "Run Visualization",
        title: "Make execution records feel like operating footage",
        reel: {
          kicker: "Run reel",
          title: "The run record should feel like a visible conveyor, not a hidden log",
          caption: "That makes throughput easier to imagine for both customers and builders."
        },
        lane: {
          kicker: "Specialist lane",
          title: "Every run belongs to a specialist system",
          caption: "Stronger role identity makes run traces easier to read and remember."
        }
      },
      builder: {
        eyebrow: "Builder",
        title: "Supply-side owner",
        open: "Open builder profile"
      },
      outcome: {
        eyebrow: "Outcome",
        title: "Execution result",
        empty: "No result summary recorded yet."
      },
      trace: {
        eyebrow: "Trace",
        title: "Execution timeline"
      },
      provenance: {
        eyebrow: "Provenance",
        title: "Agent provenance"
      }
    },
    intakeForm: {
      eyebrow: "Intake",
      title: (agentName) => `Submit demand to ${agentName}`,
      lede: "Capture the goal, expected outcome, and hard constraints before demand enters the platform workflow.",
      previewDisabled: "Preview mode is active. Task submission is intentionally disabled.",
      seededPrompts: "Launch from a seeded prompt",
      taskTitle: "Task title",
      taskTitlePlaceholder: "Example: Map the highest risks in this production workflow",
      taskDescription: "Task description",
      taskDescriptionPlaceholder: "Describe the goal, background, desired outcome, and what success looks like.",
      context: "Extra context",
      contextPlaceholder: "Add project background, business constraints, industry context, or time sensitivity.",
      submit: "Submit demand",
      submitting: "Submitting...",
      readOnly: "Read-only preview",
      invalid: "Please complete the title and description clearly.",
      failed: "Task submission failed",
      successTitle: "Task submitted",
      successPrefix: "Request",
      openRun: "Open run record",
      createdAt: "Created at"
    },
    runControls: {
      eyebrow: "Control",
      title: "Run controls",
      previewDisabled: "Preview mode is active. Run state changes are disabled.",
      currentStatus: "Current status",
      statusMessage: "Status message",
      statusMessagePlaceholder: "Add an execution note",
      resultSummary: "Result summary",
      resultSummaryPlaceholder: "Write the operator-facing outcome in one or two lines.",
      resultPayload: "Result payload (JSON)",
      resultPayloadPlaceholder: '{"summary":"Task completed","confidence":"high"}',
      invalidPayload: "Result payload must be valid JSON.",
      invalidUpdate: "Invalid status update.",
      mark: (value) => `Mark ${value}`
    },
    reviewForm: {
      eyebrow: "Review",
      title: "Operator review",
      previewDisabled: "Preview mode is active. Review submission is disabled.",
      verdict: "Verdict",
      notes: "Notes",
      notesPlaceholder: "Capture why this run should be approved, reworked, or rejected.",
      invalid: "Invalid review input.",
      submit: "Submit review",
      submitting: "Submitting...",
      readOnly: "Read-only preview",
      latest: "Latest review",
      verdictLabel: "Verdict",
      noNotes: "No review notes captured.",
      reviewedAt: "Reviewed at"
    }
  }
};

export function getCopy(locale: Locale): AppCopy {
  return copyByLocale[locale];
}
