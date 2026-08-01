const defaultTargetLength = 155;

export function getSentencePreview(text: string, targetLength = defaultTargetLength) {
  const trimmed = text.replace(/\s+/g, " ").trim();
  const minLength = Math.max(60, targetLength - 45);
  const maxLength = targetLength + 45;
  const sentenceEnds = [...trimmed.matchAll(/[.!?](?=\s|$)/g)].map((match) => match.index + 1);

  const preferredEnd =
    sentenceEnds.find((index) => index >= minLength && index <= maxLength) ??
    sentenceEnds.find((index) => index > targetLength) ??
    sentenceEnds.filter((index) => index < targetLength).at(-1);

  const end = preferredEnd ?? Math.min(targetLength, trimmed.length);
  const preview = trimmed.slice(0, end).trim();

  return {
    preview,
    shouldCollapse: preview.length < trimmed.length - 12,
  };
}
