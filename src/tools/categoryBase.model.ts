export interface CategoryBase {
    _id: string,
    name: string,
    allowChange: boolean,
    requirements?: Requirement[],
}

export interface Requirement {
    requirement: string,
}