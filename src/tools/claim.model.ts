export interface Claim {
    _id: string;
    status: string;
    employee_id: string;
    date: Date;
    receipt: string;
    description: string;
    amount: number;
    category: Category;
}

export interface Category {
    name: string;
    faceHugger?: boolean;
    locationStart?: string;
    locationEnd?: string;
    distanceKm?: number;
}