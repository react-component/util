export interface SelectionRange {
  start: number;
  end: number;
}

function getFormattedOffset(
  originStr: string,
  offset: number,
  targetStr: string,
) {
  const position = Math.min(Math.max(offset, 0), originStr.length);
  const beforeStr = originStr.slice(0, position);
  const afterStr = originStr.slice(position);

  if (targetStr.startsWith(beforeStr)) {
    return position;
  }
  if (targetStr.endsWith(afterStr)) {
    return targetStr.length - afterStr.length;
  }

  // Both sides changed, e.g. `9$ ` formatted as `$ 9`: follow the character
  // before the caret, searching from its previous position.
  const index = targetStr.indexOf(originStr[position - 1], position - 1);
  return index === -1 ? targetStr.length : index + 1;
}

/**
 * Adjust a selection of `originStr` after it is formatted as `targetStr`.
 * Each edge stays after the same text before it, or before the same text after
 * it. Otherwise it follows the character before it, or moves to the end.
 */
export default function getFormattedSelection(
  originStr: string,
  selection: SelectionRange,
  targetStr: string,
): SelectionRange {
  const start = getFormattedOffset(originStr, selection.start, targetStr);
  const end = getFormattedOffset(originStr, selection.end, targetStr);
  return { start, end: Math.max(start, end) };
}
