
/** 
 * Model for Categories stored in the categories database
 * @prop _id Stringified version of ObjectId
 * @prop name Name of the category
 * @prop allowChange Used to determine if a category can be changed in the database
 * @prop requirements A list of requirements for the category form {@link Requirement}
 * @author James Wilson
*/
export interface CategoryBase {
    _id: string,
    name: string,
    allowChange: boolean,
    requirements?: Requirement[],
}

/** 
 * List of requirements for the category used by {@link CategoryBase}
 * @prop requirement Name of the reqiuirement
 * @author James Wilson
*/
export interface Requirement {
    requirement: string,
}