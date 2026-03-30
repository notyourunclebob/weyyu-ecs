export interface Report {
    timestamp: Date,
    totalClaims: number,
    totalPending: number,
    totalApproved: number,
    totalPendingExpense: number,
    totalApprovedExpense: number,
    totalPendingPercent: number,
    totalApprovedPercent: number,
    categoryData: ReportCategory[],
}

export interface ReportCategory {
    name: string,
    total: number,
    categoryPercent: number,
    pending: number,
    approved: number,
    pendingExpense: number,
    approvedExpense: number,
    pendingPercent: number,
    approvedPercent: number,
}