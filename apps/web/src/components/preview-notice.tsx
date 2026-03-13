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
        Browsing is enabled, but task submission, status changes, and reviews are blocked.
      </span>
    </section>
  );
}
