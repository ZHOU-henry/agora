type PreviewNoticeProps = {
  readOnlyPreview: boolean;
  title: string;
  body: string;
};

export function PreviewNotice({
  readOnlyPreview,
  title,
  body
}: PreviewNoticeProps) {
  if (!readOnlyPreview) {
    return null;
  }

  return (
    <section className="previewnotice">
      <strong>{title}</strong>
      <span>{body}</span>
    </section>
  );
}
