type ResultPayloadViewProps = {
  payload: Record<string, unknown> | null | undefined;
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

export function ResultPayloadView({ payload }: ResultPayloadViewProps) {
  if (!payload || Object.keys(payload).length === 0) {
    return <p className="small">No structured result payload recorded yet.</p>;
  }

  return (
    <div className="resultgrid">
      {Object.entries(payload).map(([key, value]) => (
        <article key={key} className="resultcard">
          <p className="tagline">{key}</p>
          {renderValue(value)}
        </article>
      ))}
    </div>
  );
}
