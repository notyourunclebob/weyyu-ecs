import { ObjectId } from "mongodb";

export interface Claim {
    _id: string | ObjectId;
    status: string;
    employeeId: string;
    receipt: string;
    description: string;
    comment?: string;
    amount: number;
    category: Category;
    date: Date;
    acknowledged?: Boolean;
}

export interface Category {
    name: string;
    faceHugger?: boolean;
    locationStart?: string;
    locationEnd?: string;
    mileage?: string;
}