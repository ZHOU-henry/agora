import { cookies } from "next/headers";
import type { Locale } from "./locale";

export const accessRoleCookieName = "agora-access-role";
export const accessRoles = ["customer", "builder", "ops"] as const;
export type AccessRole = (typeof accessRoles)[number];

export function normalizeAccessRole(value: string | null | undefined): AccessRole {
  if (value === "builder" || value === "ops") {
    return value;
  }

  return "customer";
}

export function getAccessRoleRedirectPath(role: AccessRole) {
  switch (role) {
    case "builder":
      return "/builders";
    case "ops":
      return "/ops";
    default:
      return "/customer";
  }
}

export async function getAccessRole(): Promise<AccessRole> {
  const cookieStore = await cookies();
  return normalizeAccessRole(cookieStore.get(accessRoleCookieName)?.value);
}

export function getAccessRoleNavItems(role: AccessRole, locale: Locale) {
  if (role === "builder") {
    return locale === "zh"
      ? [
          { href: "/builders", label: "供给侧" },
          { href: "/demand", label: "机会板" },
          { href: "/providers", label: "开发者" },
          { href: "/engagements", label: "已承接" }
        ]
      : [
          { href: "/builders", label: "Builder" },
          { href: "/demand", label: "Opportunities" },
          { href: "/providers", label: "Builders" },
          { href: "/engagements", label: "Engagements" }
        ];
  }

  if (role === "ops") {
    return locale === "zh"
      ? [
          { href: "/ops", label: "运营台" },
          { href: "/queue", label: "执行队列" },
          { href: "/engagements", label: "承接项目" },
          { href: "/providers", label: "供给方" }
        ]
      : [
          { href: "/ops", label: "Ops" },
          { href: "/queue", label: "Queue" },
          { href: "/engagements", label: "Engagements" },
          { href: "/providers", label: "Builders" }
        ];
  }

  return locale === "zh"
    ? [
        { href: "/customer", label: "客户侧" },
        { href: "/demand", label: "需求板" },
        { href: "/providers", label: "开发者" },
        { href: "/engagements", label: "交付进度" }
      ]
    : [
        { href: "/customer", label: "Customer" },
        { href: "/demand", label: "Demand" },
        { href: "/providers", label: "Builders" },
        { href: "/engagements", label: "Delivery" }
      ];
}

const accessRoleAllowedPrefixes: Record<AccessRole, string[]> = {
  customer: ["/customer", "/demand", "/requests", "/providers", "/agents", "/engagements"],
  builder: ["/builders", "/demand", "/requests", "/providers", "/agents", "/engagements"],
  ops: ["/ops", "/queue", "/requests", "/runs", "/engagements", "/providers", "/agents", "/demand"]
};

export function canAccessRoleVisitPath(role: AccessRole, pathname: string) {
  return accessRoleAllowedPrefixes[role].some((prefix) => {
    if (pathname === prefix) {
      return true;
    }

    return pathname.startsWith(`${prefix}/`);
  });
}

function pathMatches(pathname: string, pattern: RegExp) {
  return pattern.test(pathname);
}

export function canAccessRoleWriteApiPath(
  role: AccessRole,
  method: string,
  pathname: string
) {
  if (method === "GET" || method === "HEAD") {
    return true;
  }

  if (method === "POST") {
    if (pathname === "/demand-board" || pathname === "/task-requests") {
      return role === "customer";
    }

    if (
      pathMatches(pathname, /^\/engagements\/[^/]+\/feedback$/) ||
      pathMatches(pathname, /^\/engagements\/[^/]+\/incidents$/)
    ) {
      return role === "customer";
    }

    if (
      pathname === "/providers" ||
      pathname === "/agents" ||
      pathMatches(pathname, /^\/task-requests\/[^/]+\/responses$/)
    ) {
      return role === "builder";
    }

    if (
      pathMatches(pathname, /^\/engagements\/[^/]+\/milestones$/) ||
      pathMatches(pathname, /^\/engagements\/[^/]+\/reviews$/) ||
      pathMatches(pathname, /^\/task-runs\/[^/]+\/review$/)
    ) {
      return role === "ops";
    }

    if (pathMatches(pathname, /^\/engagements\/[^/]+\/deliverables$/)) {
      return role === "builder" || role === "ops";
    }
  }

  if (method === "PATCH") {
    if (
      pathMatches(pathname, /^\/demand-responses\/[^/]+\/status$/) ||
      pathMatches(pathname, /^\/task-runs\/[^/]+\/status$/)
    ) {
      return role === "ops";
    }

    if (
      pathMatches(pathname, /^\/engagements\/[^/]+\/status$/) ||
      pathMatches(pathname, /^\/engagement-deliverables\/[^/]+\/status$/) ||
      pathMatches(pathname, /^\/engagement-feedback\/[^/]+\/status$/) ||
      pathMatches(pathname, /^\/engagement-incidents\/[^/]+\/status$/)
    ) {
      return role === "builder" || role === "ops";
    }
  }

  if (method === "PUT") {
    if (pathMatches(pathname, /^\/engagements\/[^/]+\/customer-confirmation$/)) {
      return role === "customer";
    }

    if (pathMatches(pathname, /^\/engagements\/[^/]+\/agreement$/)) {
      return role === "ops";
    }
  }

  return false;
}
