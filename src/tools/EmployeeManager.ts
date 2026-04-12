import { Collection, DeleteResult, InsertOneResult, MongoClient, ObjectId, UpdateResult } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import sanitize from "sanitize-html";
import { Employee } from "./employee.model";
import { hashPass, verifyPass } from "./PassTools";

const URL: string = process.env.DB_URL || "mongodb://mongo:27017/";
const DB_NAME: string = "ecsdb";
const COLLECTION_EMPLOYEES: string = "employees";

/** 
 * Checks login credentials to allow for ecs access. When login is successful user data is retreved from the database.
 * @param credentials a record of username and password submitted for login
 * @returns User information in an array or null if credentials are bad
 * @throws {error} if username or password are missing
 * @author James Wilson
*/
export async function nextAuthLogin(credentials: Record<"username" | "password", string>) {
    let mongoClient: MongoClient = new MongoClient(URL);

    try {
        const employeeId = sanitize(credentials.username);
        const password = sanitize(credentials.password);

        let employeeCollection: Collection<Employee> = mongoClient.db(DB_NAME).collection<Employee>(COLLECTION_EMPLOYEES);

        let user: Employee | null = await employeeCollection.findOne({ employeeId: employeeId });


        if (!user || !user.password) {
            return null;
        }

        const isVerified = await verifyPass(password, user.password);

        if (!isVerified) {
            return null;
        }

        return {
            id: user._id!.toString(),
            employeeId: user.employeeId,
            firstName: user.firstName,
            lastName: user.lastName,
            admin: user.admin,
        };

    } catch (error: any) {
        throw error;
    } finally {
        mongoClient.close();
    }
}

/** 
 * Creates a new employee from request data
 * @param request Request containing new employee data in json
 * @example
 * {
    "employeeId": "",
    "firstName": "",
    "lastName": "",
    "password": "",
    "admin": false
    }
    @returns Message and status data with insert result data from the database
    @author James Wilson
*/
export async function createEmployee(request: NextRequest) {

    let mongoClient: MongoClient = new MongoClient(URL);

    try {
        await mongoClient.connect();

        const body = await request.json();

        body.employeeId = sanitize(body.employeeId);
        body.firstName = sanitize(body.firstName);
        body.lastName =  sanitize(body.lastName);
        body.password = sanitize(body.password);

        let hashedPass: string = await hashPass(body.password);

        let newEmployee: Employee = {
            employeeId: body.employeeId,
            firstName: body.firstName,
            lastName: body.lastName,
            admin: body.admin,
            password: hashedPass,
        }

        let result: InsertOneResult = await mongoClient.db(DB_NAME).collection<Employee>(COLLECTION_EMPLOYEES).insertOne(newEmployee);

        return NextResponse.json(
            {
                message:"New employee added",
                result,
            },
            { status: 200 }
        );
    } catch(error:any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    } finally {
        mongoClient.close();
    }
}

/** 
 * When called will query datadase and return a list of all employee data
 * @returns Message and status data with an array of all employees
 * @author James Wilson
*/
export async function getEmployees() {

    let mongoClient: MongoClient = new MongoClient(URL);

    let employeeArray: Employee[];

    try {
        await mongoClient.connect();

        employeeArray = await mongoClient.db(DB_NAME).collection<Employee>(COLLECTION_EMPLOYEES).find().toArray();

        employeeArray.forEach((employee: Employee) => employee._id = employee._id!.toString());
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    } finally {
        mongoClient.close();
    }

    return NextResponse.json(
        {
            message: "Employees accessed",
            employees: employeeArray
        },
        { status: 200 }
    );
}

/** 
 * Updates employee data with data from the request
 * @param request Request containing employee data
 * @example 
 * {
    "employeeId": "",
    "firstName": "",
    "lastName": "",
    "password": "",
    "admin": false
    }
    @param id Stringified ObjectId to match the employee in the database
    @returns Message and status data with update result data from the database
    @author James Wilson
*/
export async function updateEmployee(request: NextRequest, id: string) {

    let mongoClient: MongoClient = new MongoClient(URL);

    try {
        await mongoClient.connect();

        let employeeId: ObjectId = new ObjectId(sanitize(id));

        const body: any = await request.json();

        body.firstName = sanitize(body.firstName);
        body.lastName = sanitize(body.lastName);
        // ***need to add a way to check and change passwords***
        // body.password = sanitize(body.password);

        let employeeCollection: Collection<Employee> = mongoClient.db(DB_NAME).collection<Employee>(COLLECTION_EMPLOYEES);
        let selector: Object = { "_id": employeeId };
        let newValues: Object = {
            $set: {
                firstName: body.firstName,
                lastName: body.lastName,
                admin: body.admin
            }
        };
        let result: UpdateResult = await employeeCollection.updateOne(selector, newValues);

        if (result.matchedCount <= 0) {
            return NextResponse.json(
                { error: "Employee id doesn't exist" },
                { status: 404, statusText: "Employee id doesn't exist" }
            );
        } else {
            return NextResponse.json(
                {
                    message: "Employee updated",
                    result
                },
                { status: 200 }
            );
        }
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    } finally {
        mongoClient.close();
    }
}

/** 
 * Deletes an employee from the employees database
 * @param request Request contailning ObjectId of the employee to delete
 * @example
 * { "_id": "" }
 * @returns Message and status data with delete result data from the database
 * @author James Wilson
*/
export async function deleteEmployee(request: NextRequest) {

    let mongoClient: MongoClient = new MongoClient(URL);

    try {
        await mongoClient.connect();

        const body = await request.json();

        let id: ObjectId = new ObjectId(sanitize(body._id));

        let selector: Object = { "_id": id };

        let result: DeleteResult = await mongoClient.db(DB_NAME).collection<Employee>(COLLECTION_EMPLOYEES).deleteOne(selector);

        if (result.deletedCount <= 0) {
            let error = `Employee _id: ${id} failed to delete`
                return NextResponse.json(
                    { error:  error },
                    { status: 500, statusText: error }
                );
        } else {
                return NextResponse.json(
                    {
                        message: `Employee _id: ${id} successfully deleted`,
                        result
                    },
                    { status: 200 }
                );
            }   

    } catch(error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    } finally {
        mongoClient.close();
    }
}