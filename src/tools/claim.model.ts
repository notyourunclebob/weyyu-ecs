export interface Claim {
    _id:         string;
    status:      string;
    employeeId:  string;
    receipt:     string;
    description: string;
    comment?:    string;
    amount:      number;
    category:    Category;
    date:        Date;
}

export interface Category {
    name:           string;
    faceHugger?:    boolean;
    locationStart?: string;
    locationEnd?:   string;
    distanceKm?:    number;
}