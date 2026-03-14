const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short"
});

export function formatTimestamp(value: string | null | undefined) {
  if (!value) {
    return "Not recorded";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateFormatter.format(date);
}

export function humanizeToken(value: string) {
  return value.replaceAll("_", " ").replaceAll("-", " ");
}

export function titleizeToken(value: string) {
  const humanized = humanizeToken(value);
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
