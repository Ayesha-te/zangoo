const defaultTargetLength = 62;

export function getSentencePreview(text: string, targetLength = defaultTargetLength) {
  const trimmed = text.replace(/\s+/g, " ").trim();
  const minLength = Math.max(35, targetLength - 18);
  const maxLength = targetLength + 20;
  const sentenceEnds = [...trimmed.matchAll(/[.!?](?=\s|$)/g)].map((match) => match.index + 1);

  const preferredEnd =
    sentenceEnds.find((index) => index >= minLength && index <= maxLength && index < trimmed.length - 12) ??
    sentenceEnds.filter((index) => index < targetLength).at(-1);

  const fallbackEnd = trimmed.lastIndexOf(" ", targetLength);
  const end = preferredEnd ?? (fallbackEnd > minLength ? fallbackEnd : Math.min(targetLength, trimmed.length));
  const preview = trimmed.slice(0, end).trim();
  const shouldCollapse = preview.length < trimmed.length - 12;

  return {
    preview: shouldCollapse && !/[.!?]$/.test(preview) ? `${preview}...` : preview,
    shouldCollapse,
  };
}
