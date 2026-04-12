import { ObjectId } from "mongodb";

/** 
 * Model for claom data in the claims database
 * @prop _id Stringified version of ObjectId
 * @prop status Review status of the claim
 * @prop employeeId Id number of the employee making the claim
 * @prop receipt Filename of the receipt image
 * @prop description Description of the claim
 * @prop comment Comment made by the claim reviewer
 * @prop ammount Dollar value of the claims expense
 * @prop category Specific data for the category the claim belongs to
 * @prop date Date the claim was submitted
 * @prop acknowledged Indicates if a claim has been acknowledged by a reviewer
 * @author James Wilson
*/
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

/** 
 * Category spececific data
 * @prop name Name of the category
 * @prop facehugger Indicates if a medical claim is related to a facehugger encounter
 * @prop locationStart Location of travel origin
 * @prop locationEnd Final destination of travel
 * @prop mileage Total distence traveled
 * @author James Wilson
*/
export interface Category {
    name: string;
    faceHugger?: boolean;
    locationStart?: string;
    locationEnd?: string;
    mileage?: string;
}