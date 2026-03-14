type PreviewNoticeProps = {
  readOnlyPreview: boolean;
};

export function PreviewNotice({ readOnlyPreview }: PreviewNoticeProps) {
  if (!readOnlyPreview) {
    return null;
  }

  return (
    <section className="previewnotice">
      <strong>Read-only preview mode</strong>
      <span>
        Browsing stays enabled, but task submission, run state changes, and review
        actions are blocked by both the UI and API.
      </span>
    </section>
  );
}
