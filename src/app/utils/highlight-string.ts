export function getChunks({ text, substrings }: { text: string; substrings: string[] }): { highlighted: boolean; text: string }[] {
  if (!text || !substrings || !substrings.length) {
    return [{ highlighted: false, text }];
  }

  const needle = (substrings[0] ?? '').toString();
  if (!needle) {
    return [{ highlighted: false, text }];
  }

  const lowerText = text.toLowerCase();
  const lowerNeedle = needle.toLowerCase();

  const chunks: { highlighted: boolean; text: string }[] = [];
  let index = 0;
  let matchIndex = lowerText.indexOf(lowerNeedle, index);

  while (matchIndex !== -1) {
    if (matchIndex > index) {
      chunks.push({ highlighted: false, text: text.slice(index, matchIndex) });
    }
    chunks.push({ highlighted: true, text: text.slice(matchIndex, matchIndex + needle.length) });
    index = matchIndex + needle.length;
    matchIndex = lowerText.indexOf(lowerNeedle, index);
  }

  if (index < text.length) {
    chunks.push({ highlighted: false, text: text.slice(index) });
  }

  return chunks;
}
