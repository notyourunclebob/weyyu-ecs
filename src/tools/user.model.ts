
/** 
 * Model for the Current logged in user
 * @prop id Stringified version of ObjectId
 * @prop employeeId Id used for employee login
 * @prop firstName Employee's first name
 * @prop lastName Employee's last name
 * @prop admin Indicates if the employee had an administrator role
 * @author James Wilson
*/
export interface User {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    admin: boolean;
}