// ai generated svg pie chart calculation

export interface PieSlice {
  label: string;
  percentage: number;
  color: string;
}

export interface ComputedSlice extends PieSlice {
  startAngle: number;
  endAngle: number;
}

export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCartesian(cx, cy, r, end);
  const e = polarToCartesian(cx, cy, r, start);
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${end - start > 180 ? 1 : 0} 0 ${e.x} ${e.y} Z`;
}

export function computeSlices(data: PieSlice[]): ComputedSlice[] {
  let cumulative = 0;

  return data.map((slice) => {
    const startAngle = (cumulative / 100) * 360;
    cumulative += slice.percentage;
    const endAngle = (cumulative / 100) * 360;
    return { ...slice, startAngle, endAngle };
  });
}