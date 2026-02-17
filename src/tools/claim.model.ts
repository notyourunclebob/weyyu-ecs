export interface Claim {
    _id:         string;
    Status:      string;
    employee_id: string;
    receipt:     string;
    description: string;
    category:    Category;
}

export interface Category {
    name:           string;
    faceHugger?:    boolean;
    locationStart?: string;
    locationEnd?:   string;
    distanceKm?:    number;
}