//  AI generated method to build a pie chart
/**
 * @packageDocumentation
 * @module pie-chart
 *
 * Utilities for generating server-side SVG pie charts in Next.js.
 * Designed for use in React Server Components with no client-side JavaScript required.
 *
 * @example
 * ```tsx
 * // app/components/PieChart.tsx
 * import { computeSlices, describeArc, sliceLabelPosition, type PieSlice } from "@/lib/pie-chart";
 *
 * export default function PieChart({ data, size = 200 }: { data: PieSlice[]; size?: number }) {
 *   const cx = size / 2, cy = size / 2, r = size / 2 - 10;
 *   const slices = computeSlices(data);
 *   return (
 *     <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
 *       {slices.map((s, i) => (
 *         <path key={i} d={describeArc(cx, cy, r, s.startAngle, s.endAngle)} fill={s.color} />
 *       ))}
 *     </svg>
 *   );
 * }
 * ```
 */

/**
 * Represents a single slice of a pie chart.
 * @author James Wilson (AI Tooled)
 */
export interface PieSlice {
  /** Display label for the slice, used in legends and SVG text elements. */
  label: string;
  /**
   * The slice's share of the chart as a percentage.
   * All slices should sum to 100. If they do not, the last slice
   * is clamped to 360° to prevent rendering gaps.
   */
  percentage: number;
  /** Fill color for the slice. Accepts any valid CSS color string (hex, rgb, hsl, etc.). */
  color: string;
}

/**
 * A {@link PieSlice} with computed angular positions for SVG rendering.
 * Returned by {@link computeSlices}.
 * @author James Wilson (AI Tooled)
 */
export interface ComputedSlice extends PieSlice {
  /** The angle in degrees at which this slice begins (0° = 12 o'clock). */
  startAngle: number;
  /** The angle in degrees at which this slice ends (0° = 12 o'clock). */
  endAngle: number;
}

/**
 * Converts polar coordinates to Cartesian coordinates on a circle.
 *
 * @param cx - The x-coordinate of the circle's center.
 * @param cy - The y-coordinate of the circle's center.
 * @param r - The radius of the circle.
 * @param angleDeg - The angle in degrees, measured clockwise from 12 o'clock (0° = top).
 * @returns An `{ x, y }` point on the circle's circumference.
 *
 * @example
 * ```ts
 * // Top of a circle centered at (100, 100) with radius 80
 * polarToCartesian(100, 100, 80, 0); // { x: 100, y: 20 }
 * ```
 * @author James Wilson (AI Tooled)
 */
export function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

/**
 * Builds an SVG path `d` string describing a pie slice as a filled arc.
 *
 * The path begins at the circle's center, draws a line to the arc start,
 * follows the arc, and closes back to the center — forming a wedge shape.
 *
 * @param cx - The x-coordinate of the circle's center.
 * @param cy - The y-coordinate of the circle's center.
 * @param r - The radius of the circle.
 * @param startAngle - The start angle in degrees (clockwise from 12 o'clock).
 * @param endAngle - The end angle in degrees (clockwise from 12 o'clock).
 * @returns A valid SVG path `d` attribute string.
 *
 * @example
 * ```tsx
 * <path d={describeArc(100, 100, 80, 0, 90)} fill="#6366f1" />
 * ```
 * @author James Wilson (AI Tooled)
 */
export function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const s = polarToCartesian(cx, cy, r, endAngle);
  const e = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y} Z`;
}

/**
 * Computes the midpoint position of a slice for label placement.
 *
 * The returned point lies on a circle at a fraction of the radius,
 * centered on the slice's angular midpoint — suitable for SVG `<text>` positioning.
 *
 * @param cx - The x-coordinate of the circle's center.
 * @param cy - The y-coordinate of the circle's center.
 * @param r - The radius of the circle.
 * @param startAngle - The start angle of the slice in degrees.
 * @param endAngle - The end angle of the slice in degrees.
 * @param offset - Fractional distance from center to edge. `0` = center, `1` = edge.
 *   Defaults to `0.6`, which places labels at 60% of the radius.
 * @returns An `{ x, y }` point suitable for use as SVG text coordinates.
 *
 * @example
 * ```tsx
 * const pos = sliceLabelPosition(100, 100, 80, 0, 90);
 * <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle">Label</text>
 * ```
 * @author James Wilson (AI Tooled)
 */
export function sliceLabelPosition(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
  offset = 0.6
): { x: number; y: number } {
  const midAngle = (startAngle + endAngle) / 2;
  return polarToCartesian(cx, cy, r * offset, midAngle);
}

/**
 * Converts an array of {@link PieSlice} values into {@link ComputedSlice} objects
 * with pre-calculated start and end angles for SVG rendering.
 *
 * Slices are laid out sequentially in clockwise order starting from 12 o'clock.
 * The final slice is always clamped to exactly 360° to prevent gaps caused by
 * floating-point rounding when percentages don't sum to precisely 100.
 *
 * @param data - Array of pie slices with percentage values. Should sum to 100.
 * @returns Array of slices with `startAngle` and `endAngle` in degrees.
 * @throws {Error} If `data` is not an array.
 *
 * @example
 * ```ts
 * const slices = computeSlices([
 *   { label: "A", percentage: 40, color: "#6366f1" },
 *   { label: "B", percentage: 30, color: "#22d3ee" },
 *   { label: "C", percentage: 30, color: "#f59e0b" },
 * ]);
 * // slices[0] => { ..., startAngle: 0, endAngle: 144 }
 * // slices[1] => { ..., startAngle: 144, endAngle: 252 }
 * // slices[2] => { ..., startAngle: 252, endAngle: 360 }
 * ```
 * @author James Wilson (AI Tooled)
 */
export function computeSlices(data: PieSlice[]): ComputedSlice[] {
  if (!Array.isArray(data)) {
    throw new Error(
      `computeSlices expected an array, got: ${typeof data} — ${JSON.stringify(data)}`
    );
  }

  let cumulative = 0;

  return data.map((slice, i) => {
    const startAngle = (cumulative / 100) * 360;
    cumulative += slice.percentage;
    const endAngle = i === data.length - 1 ? 360 : (cumulative / 100) * 360;
    return { ...slice, startAngle, endAngle };
  });
}