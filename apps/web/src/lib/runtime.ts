export function isReadOnlyPreviewMode() {
  return process.env.NEXT_PUBLIC_AGORA_PREVIEW_MODE === "readonly";
}
