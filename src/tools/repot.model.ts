export interface Report {
    timestamp: Date,
    totalClaims: number,
    totalPending: number,
    totalApproved: number,
    totalDenied:number,
    totalPendingExpense: number,
    totalApprovedExpense: number,
    totalPendingPercent: number,
    totalApprovedPercent: number,
    totalDeniedPercent:number,
    categoryData: ReportCategory[],
}

export interface ReportCategory {
    name: string,
    total: number,
    categoryPercent: number,
    pending: number,
    approved: number,
    denied: number,
    pendingExpense: number,
    approvedExpense: number,
    pendingPercent: number,
    approvedPercent: number,
    deniedPercent: number,
}