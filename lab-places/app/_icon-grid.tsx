import type { ReactElement } from 'react';

/**
 * 3×3 colour palette.
 * Uses Apple iOS system colours — calibrated to look great together at any size.
 * Update this array to change the icon everywhere at once.
 */
export const ICON_COLORS: readonly string[] = [
  '#FF3B5C', // red-pink  — top-left
  '#1C1C1E', // near-black— top-center
  '#FF9500', // orange    — top-right
  '#30D158', // green     — mid-left
  '#000000', // black     — center
  '#0A84FF', // blue      — mid-right
  '#BF5AF2', // purple    — bot-left
  '#AEAEB2', // silver    — bot-center
  '#32ADE6', // teal-blue — bot-right
];

interface GridOptions {
  size: number;
  /** Padding from icon edge to first cell. */
  padding: number;
  /** Gap between cells. */
  gap: number;
  /** Cell width and height. Invariant: 2*padding + 3*cell + 2*gap === size */
  cell: number;
  /** Corner radius of the outer rounded square (0 = no rounding). */
  radius: number;
  /** Corner radius of each colour cell. */
  cellRadius: number;
}

/**
 * Returns Satori-compatible JSX for the 3×3 grid icon.
 * Uses absolute positioning for pixel-exact cell placement —
 * more reliable in Satori than flex-wrap + gap.
 */
export function iconGrid({
  size,
  padding,
  gap,
  cell,
  radius,
  cellRadius,
}: GridOptions): ReactElement {
  const step = cell + gap;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        background: '#0A0A0F',
        borderRadius: radius,
        overflow: 'hidden',
        display: 'flex', // Satori requires a display value on root
      }}
    >
      {ICON_COLORS.map((color, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: padding + col * step,
              top: padding + row * step,
              width: cell,
              height: cell,
              background: color,
              borderRadius: cellRadius,
            }}
          />
        );
      })}
    </div>
  );
}
