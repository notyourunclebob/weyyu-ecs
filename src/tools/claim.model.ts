import { ObjectId } from "mongodb";

export interface Claim {
    _id: string | ObjectId;
    status: string;
    employeeId: string;
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