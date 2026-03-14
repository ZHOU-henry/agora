import type { Locale } from "../lib/locale";
import { humanizeToken } from "../lib/presenters";

type ResultPayloadViewProps = {
  payload: Record<string, unknown> | null | undefined;
  locale: Locale;
  emptyLabel: string;
};

function renderValue(value: unknown) {
  if (value === null || value === undefined) {
    return <span className="small">null</span>;
  }

  if (Array.isArray(value)) {
    return (
      <div className="chiprow">
        {value.map((item, index) => (
          <span key={`${index}-${String(item)}`} className="datachip">
            {String(item)}
          </span>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    return <pre className="codeblock">{JSON.stringify(value, null, 2)}</pre>;
  }

  return <span>{String(value)}</span>;
}

export function ResultPayloadView({
  payload,
  locale,
  emptyLabel
}: ResultPayloadViewProps) {
  if (!payload || Object.keys(payload).length === 0) {
    return <p className="small">{emptyLabel}</p>;
  }

  return (
    <div className="resultgrid">
      {Object.entries(payload).map(([key, value]) => (
        <article key={key} className="resultcard">
          <p className="tagline">{humanizeToken(key, locale)}</p>
          {renderValue(value)}
        </article>
      ))}
    </div>
  );
}
