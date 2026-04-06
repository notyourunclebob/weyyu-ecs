import { Report, ReportCategory } from "@/tools/repot.model";

// comapers numbers to get a percentage rounding to nearest integer
function calcPercent(number: number, totalNumber: number) {
  return Math.round((number / totalNumber) * 100);
}

export function CategoryBarChart({ data }: { data: ReportCategory[] }) {
  // the largest total out of all category totals
  const maxTotal: number = data.reduce((max, data) => {
    return data.total > max ? data.total : max;
  }, Number.NEGATIVE_INFINITY);

  return (
    <div className="w-full p-4 bg-gray-200 border border-gray-300">
      <div className="pb-4">fig #3 : Status of claims by category</div>
      <div className="flex justify-between h-full">
        <div className="font-mono flex flex-col gap-2">
          <div className="bg-bar-total px-1">Total</div>
          <div className="bg-bar-pending px-1">Pending</div>
          <div className="bg-bar-approved px-1">Approved</div>
          <div className="bg-bar-denied px-1">Denied</div>
        </div>
        <div className="w-full flex h-75 justify-around">
          {data.map((categoryData: ReportCategory, index) => (
            <div key={index} className="flex flex-col items-center justify-end">
              <div
                className="flex items-end font-mono gap-2"
                style={{
                  height: `${calcPercent(categoryData.total, maxTotal)}%`,
                }}
              >
                <div className="bg-bar-total h-full w-5 text-center">
                  {categoryData.total}
                </div>
                <div
                  className="bg-bar-pending w-5 text-center"
                  style={{ height: `${categoryData.pendingPercent}%` }}
                >
                  {categoryData.pending}
                </div>
                <div
                  className="bg-bar-approved w-5 text-center"
                  style={{ height: `${categoryData.approvedPercent}%` }}
                >
                  {categoryData.approved}
                </div>
                <div
                  className="bg-bar-denied w-5 text-center"
                  style={{
                    height: `${categoryData.deniedPercent}%`,
                  }}
                >
                  {categoryData.denied > 0 ? categoryData.denied : ""}
                </div>
              </div>
              <div>{categoryData.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ExpenseBarchart({ data }: { data: Report }) {
  return (
    <div className="w-full p-4 bg-gray-200 border border-gray-300">
      <div className="pb-4">fig#1 : Claim expenses</div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 font-mono">
          <div className="bg-expense-approved px-1">Approved</div>
          <div className="bg-expense-pending px-1">Pending</div>
        </div>
        <div>
          <div className="w-30">Total</div>
          <div className="flex gap-2 items-center">
            <div className="font-mono w-30">
              <div>
                $
                {data.totalApprovedExpense.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div>
                $
                {data.totalPendingExpense.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="w-full h-full">
              <div className="w-full h-4 bg-expense-approved mb-2"></div>
              <div
                className="h-4 bg-expense-pending"
                style={{
                  width: `${calcPercent(data.totalPendingExpense, data.totalApprovedExpense)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
        {data.categoryData.map((categoryData: ReportCategory, index) => (
          <div key={index}>
            <div className="w-30">{categoryData.name}:</div>
            <div className="flex gap-2 items-center">
              <div className="font-mono w-30">
                <div>
                  $
                  {categoryData.approvedExpense.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div>
                  $
                  {categoryData.pendingExpense.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div className="w-full h-full">
                <div
                  className="h-4 mb-2 bg-expense-approved"
                  style={{
                    width: `${calcPercent(categoryData.approvedExpense, data.totalApprovedExpense)}%`,
                  }}
                ></div>
                <div
                  className="h-4 bg-expense-pending"
                  style={{
                    width: `${calcPercent(categoryData.pendingExpense, data.totalApprovedExpense)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
