
/** 
 * Model for employee data
 * @prop _id Stringified version of ObjectId
 * @prop employeeId Id used for employee login
 * @prop firstName Employee's first name
 * @prop lastName Employee's last name
 * @prop admin Indicates if the employee had an administrator role
 * @prop password Salt and Hash for the employee's password
 * @author James Wilson
*/
export interface Employee {
    _id?:        string;
    employeeId: string;
    firstName:  string;
    lastName:   string;
    admin:      boolean;
    password:   string;
}
