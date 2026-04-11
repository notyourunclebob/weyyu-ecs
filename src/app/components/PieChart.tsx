import { computeSlices, describeArc, type PieSlice } from "@/tools/PieChartGen";

export default function PieChart({
  data,
  size = 100,
}: {
  data: PieSlice[];
  size?: number;
}) {
  const cx = size / 2,
    cy = size / 2,
    r = size / 2 - 10;
  const slices = computeSlices(data);

  return (
    <div className="w-fit bg-white border border-gray-300 p-4">
      <div className="pb-4">fig #3 : Percent of claims by category</div>
      <div className="flex h-full">
        <div className="font-mono flex flex-col gap-2 pr-2">
          {data.map((category: PieSlice, index) => (
            <div
              key={index}
              className="flex justify-between gap-2 px-1"
              style={{ backgroundColor: category.color }}
            >
              <span>{category.label}:</span>
              <span>{category.percentage}%</span>
            </div>
          ))}
        </div>
        <div>
          <svg
            className="self-center"
            viewBox={`0 0 ${size} ${size}`}
            width={size}
            height={size}
          >
            {slices.map((s, i) => (
              <path
                key={i}
                d={describeArc(cx, cy, r, s.startAngle, s.endAngle)}
                fill={s.color}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
