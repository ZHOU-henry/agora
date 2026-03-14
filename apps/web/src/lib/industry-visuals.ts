import type {
  AgentDefinition,
  EngagementDetail,
  ProviderProfileDetail,
  TaskRequestDetail
} from "@agora/shared/domain";
import type { Locale } from "./locale";

type MediaVisual = {
  src: string;
  alt: string;
  kicker: string;
  title: string;
  caption: string;
  mode?: string;
};

type VisualPair = {
  primary: MediaVisual;
  secondary: MediaVisual;
};

type ScenarioKey =
  | "manufacturing"
  | "quality"
  | "warehouse"
  | "maintenance"
  | "control";

function getScenarioKeyFromIndustry(industry: string) {
  const value = industry.toLowerCase();

  if (value.includes("quality")) return "quality" as const;
  if (value.includes("warehouse")) return "warehouse" as const;
  if (value.includes("maintenance")) return "maintenance" as const;
  if (value.includes("manufacturing")) return "manufacturing" as const;

  return "control" as const;
}

function getScenarioKeyFromAgentSlug(slug: string) {
  switch (slug) {
    case "quality-sentinel":
      return "quality" as const;
    case "warehouse-wave-planner":
      return "warehouse" as const;
    case "maintenance-copilot":
      return "maintenance" as const;
    case "line-orchestrator":
      return "manufacturing" as const;
    default:
      return "control" as const;
  }
}

function getScenarioVisualSet(scenario: ScenarioKey, locale: Locale): VisualPair {
  if (scenario === "quality") {
    return locale === "zh"
      ? {
          primary: {
            src: "/media/industrial-quality-cell-flow.gif",
            alt: "工业质检单元 GIF，包含顶视相机、Vision Agent 判断、机械臂分拣与 OK/NG 流转。",
            kicker: "工业质检单元",
            title: "相机、Vision Agent 与机械臂形成闭环质检",
            caption: "更接近真实制造现场的部署对象：相机采图、Agent 判缺陷、机械臂分流、QA 台留痕。",
            mode: "gif"
          },
          secondary: {
            src: "/media/industrial-quality-deployment-map.png",
            alt: "工业质检部署图，展示相机阵列、边缘推理、PLC/机器人单元与 QA 控制台。",
            kicker: "部署地图",
            title: "从相机阵列到 QA 控制台的完整落地链路",
            caption: "让客户、开发者和运营都看到系统是如何部署在工位、边缘盒与审核台上的。",
            mode: "still"
          }
        }
      : {
          primary: {
            src: "/media/industrial-quality-cell-flow.gif",
            alt: "Industrial QA cell GIF with overhead camera, vision-agent scoring, robot-arm rejection, and OK/NG flow.",
            kicker: "Industrial quality cell",
            title: "Camera, vision agent, and robot arm in one inspection loop",
            caption: "A more realistic manufacturing deployment: camera capture, defect scoring, robotic rejection, and QA traceability.",
            mode: "gif"
          },
          secondary: {
            src: "/media/industrial-quality-deployment-map.png",
            alt: "Deployment map showing camera array, edge inference, PLC robot cell, and QA console.",
            kicker: "Deployment map",
            title: "A full path from camera array to QA console",
            caption: "It makes the system legible as a deployed industrial workflow instead of a floating AI feature.",
            mode: "still"
          }
        };
  }

  if (scenario === "warehouse") {
    return locale === "zh"
      ? {
          primary: {
            src: "/media/warehouse-autopicker-flow.gif",
            alt: "仓储自主拣选机器人 GIF，展示 WMS 派单、巷道移动、取箱和打包站闭环。",
            kicker: "仓储自主拣选",
            title: "WMS、巷道机器人和打包站形成履约闭环",
            caption: "这更像真实仓内部署：任务派发、机器人进巷道、取箱合单，再流向打包站。",
            mode: "gif"
          },
          secondary: {
            src: "/media/warehouse-autopicker-map.png",
            alt: "仓储部署地图，展示 WMS 任务层、巷道机器人与 pack station。",
            kicker: "仓储部署图",
            title: "把仓储 Agent 讲成一套任务与机器人系统",
            caption: "Builder 真正交付的是任务系统、移动机器人和履约闭环，不是一句抽象仓储 AI。",
            mode: "still"
          }
        }
      : {
          primary: {
            src: "/media/warehouse-autopicker-flow.gif",
            alt: "Warehouse autopicker GIF showing WMS missioning, aisle movement, tote retrieval, and pack-station closure.",
            kicker: "Warehouse autopicker",
            title: "WMS, aisle robot, and pack station in one fulfillment loop",
            caption: "Closer to a real warehouse deployment: mission dispatch, aisle retrieval, tote consolidation, and pack-station flow.",
            mode: "gif"
          },
          secondary: {
            src: "/media/warehouse-autopicker-map.png",
            alt: "Warehouse deployment map with WMS missioning, aisle robot, and pack station.",
            kicker: "Warehouse map",
            title: "Explain the warehouse agent as a mission and robotics system",
            caption: "What a builder really ships is not a slogan but a missioning layer, a robot flow, and a fulfillment closure loop.",
            mode: "still"
          }
        };
  }

  if (scenario === "maintenance") {
    return locale === "zh"
      ? {
          primary: {
            src: "/media/maintenance-patrol-flow.gif",
            alt: "巡检维护机器人 GIF，展示热成像扫描、异常判断和工单推进。",
            kicker: "巡检维护回路",
            title: "巡检机器人、热成像与维护 Agent 联动推进工单",
            caption: "这更接近传统工业维护现场：机器人巡检、发现热点异常、Agent 建议下一步并推进工单。",
            mode: "gif"
          },
          secondary: {
            src: "/media/maintenance-agent-stack.png",
            alt: "维护 Agent 部署栈图，展示传感输入、维护推理、现场动作和买方价值。",
            kicker: "维护部署栈",
            title: "把维护 Agent 讲成巡检、推理与闭环执行系统",
            caption: "输入、异常判断、工单动作和停机价值被放在一起，产品才像真实工业系统。",
            mode: "still"
          }
        }
      : {
          primary: {
            src: "/media/maintenance-patrol-flow.gif",
            alt: "Inspection robot GIF showing thermal scan, anomaly detection, and work-order progression.",
            kicker: "Maintenance patrol loop",
            title: "Inspection robot, thermal scan, and maintenance agent in one loop",
            caption: "This is closer to a real maintenance deployment: robotic patrol, hotspot detection, agent recommendation, and work-order follow-through.",
            mode: "gif"
          },
          secondary: {
            src: "/media/maintenance-agent-stack.png",
            alt: "Maintenance agent deployment stack with field inputs, maintenance reasoning, plant actions, and buyer impact.",
            kicker: "Maintenance stack",
            title: "Explain the maintenance agent as a patrol, reasoning, and closure system",
            caption: "Inputs, anomaly reasoning, plant action, and downtime impact belong in one frame if the product is to look real.",
            mode: "still"
          }
        };
  }

  if (scenario === "manufacturing") {
    return locale === "zh"
      ? {
          primary: {
            src: "/media/factory-command-loop.svg",
            alt: "工厂指挥场景，展示异常指挥、产线调度与班次交接。",
            kicker: "产线指挥",
            title: "让 Agent 站到产线异常、调度和交接的真实位置上",
            caption: "这类部署更偏向生产节奏、异常解释和班组指挥，而不是单个视觉检测单元。",
            mode: "scene"
          },
          secondary: {
            src: "/media/industrial-quality-builder-stack.png",
            alt: "工业 Builder 部署栈图，展示现场输入、Agent 核心、工厂输出与买方价值。",
            kicker: "交付结构",
            title: "制造场景 Builder 卖的是调度与执行闭环，不是纯聊天界面",
            caption: "现场事件输入、Agent 策略层、现场动作和价值闭环一起，才像真正的制造业部署。",
            mode: "still"
          }
        }
      : {
          primary: {
            src: "/media/factory-command-loop.svg",
            alt: "Factory command scene showing exception command, line scheduling, and shift handover.",
            kicker: "Factory command",
            title: "Put the agent into the real line-side position of exception command and handover",
            caption: "This deployment is about production cadence, exception interpretation, and shift coordination rather than only image inspection.",
            mode: "scene"
          },
          secondary: {
            src: "/media/industrial-quality-builder-stack.png",
            alt: "Industrial builder stack showing site inputs, agent core, factory outputs, and buyer value.",
            kicker: "Delivery structure",
            title: "Manufacturing builders sell a control and execution loop, not a chat surface",
            caption: "Site events, strategy layer, plant actions, and value closure make the manufacturing deployment object legible.",
            mode: "still"
          }
        };
  }

  return locale === "zh"
    ? {
        primary: {
          src: "/media/control-theater-loop.svg",
          alt: "平台控制台场景图。",
          kicker: "平台场景",
          title: "把需求、供给、执行与审核放进同一操作面",
          caption: "在缺少更具体行业上下文时，先用平台控制面来解释对象所在的大系统。",
          mode: "loop"
        },
        secondary: {
          src: "/media/builder-network-loop.svg",
          alt: "开发者网络场景图。",
          kicker: "供给网络",
          title: "对象并不孤立，它属于更大的供给和交付网络",
          caption: "这能避免页面退化成单个对象的后台记录。",
          mode: "loop"
        }
      }
    : {
        primary: {
          src: "/media/control-theater-loop.svg",
          alt: "Platform control surface scene.",
          kicker: "Platform frame",
          title: "Keep demand, supply, execution, and review inside one operating surface",
          caption: "When no tighter industry context is available, explain the object through the broader platform control frame.",
          mode: "loop"
        },
        secondary: {
          src: "/media/builder-network-loop.svg",
          alt: "Builder network scene.",
          kicker: "Supply network",
          title: "The object belongs to a broader supply and delivery network",
          caption: "This stops the page from collapsing back into a static backend record.",
          mode: "loop"
        }
      };
}

export function getTaskRequestVisuals(
  request: Pick<TaskRequestDetail, "industry" | "agent">,
  locale: Locale
) {
  const scenario =
    request.industry.length > 0
      ? getScenarioKeyFromIndustry(request.industry)
      : getScenarioKeyFromAgentSlug(request.agent.slug);

  return getScenarioVisualSet(scenario, locale);
}

export function getEngagementVisuals(
  engagement: Pick<EngagementDetail, "taskRequest" | "agent">,
  locale: Locale
) {
  const scenario =
    engagement.taskRequest.industry.length > 0
      ? getScenarioKeyFromIndustry(engagement.taskRequest.industry)
      : getScenarioKeyFromAgentSlug(engagement.agent.slug);

  return getScenarioVisualSet(scenario, locale);
}

export function getProviderVisuals(
  provider: Pick<ProviderProfileDetail, "tags">,
  locale: Locale
) {
  const tags = provider.tags.join(" ").toLowerCase();

  if (tags.includes("quality") || tags.includes("inspection")) {
    return getScenarioVisualSet("quality", locale);
  }
  if (tags.includes("warehouse") || tags.includes("logistics")) {
    return getScenarioVisualSet("warehouse", locale);
  }
  if (tags.includes("maintenance") || tags.includes("field")) {
    return getScenarioVisualSet("maintenance", locale);
  }
  if (tags.includes("manufacturing") || tags.includes("industrial")) {
    return getScenarioVisualSet("manufacturing", locale);
  }

  return getScenarioVisualSet("control", locale);
}

export function getAgentVisuals(
  agent: Pick<AgentDefinition, "slug">,
  locale: Locale
) {
  return getScenarioVisualSet(getScenarioKeyFromAgentSlug(agent.slug), locale);
}
