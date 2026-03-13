export const runtimeMode = {
  previewReadOnly: process.env.AGORA_PREVIEW_MODE === "readonly"
} as const;

export function isReadOnlyPreviewMode() {
  return runtimeMode.previewReadOnly;
}
