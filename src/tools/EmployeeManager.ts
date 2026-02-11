import { Collection, MongoClient, ObjectId, UpdateResult } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import sanitize from "sanitize-html";
import { Employee } from "./employee.model";
import { verifyPass } from "./PassTools";

const URL: string = process.env.DB_URL || "mongodb://mongo:27017/";
const DB_NAME: string = "ecsDb";
const COLLECTION_EMPLOYEES: string = "employees";

/** 
 * Checks login credentials to allow for ecs access. When login is successful user data is retreved from the database.
 * @param credentials a record of username and password submitted for login
*/
export async function nextAuthLogin(credentials: Record<"username" | "password", string>) {
    let mongoClient: MongoClient = new MongoClient(URL);

    try {
        const employeeId = sanitize(credentials.username);
        const password = sanitize(credentials.password);

        let employeeCollection: Collection<Employee> = mongoClient.db(DB_NAME).collection<Employee>(COLLECTION_EMPLOYEES);

        let user: Employee | null = await employeeCollection.findOne({ employeeId: employeeId });

        if (!user || !user.password) {
            throw new Error("Invalid credentials");
        }

        const isVerified = await verifyPass(password, user.password);

        if (!isVerified) {
            throw new Error("Invalid credentials");
        }

        return {
            id: user._id.toString(),
            employeeId: user.employeeId,
            firstName: user.firstName,
            lastName: user.lastName,
            admin: user.admin,
        };

    } catch (error:any) {
        throw new Error("Connection failed");
    } finally {
        mongoClient.close();
    }
}

/** 
 * When called will query datadase and return a list of all employee data
*/
export async function getEmployees() {
    
    let mongoClient: MongoClient = new MongoClient(URL);

    let employeeArray:Employee[];

    try {
        await mongoClient.connect();

        employeeArray = await mongoClient.db(DB_NAME).collection<Employee>(COLLECTION_EMPLOYEES).find().toArray();

        employeeArray.forEach((employee:Employee) => employee._id = employee._id.toString())
    } catch (error:any) {
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

// *** this is out of scope ***
// updates an existing employee 
export async function updateEmployee(request:NextRequest, id:string) {

    let mongoClient: MongoClient = new MongoClient(URL);

    try {
        await mongoClient.connect();

        let employeeId:ObjectId = new ObjectId(sanitize(id));

        const body:any = await request.json();

        body.firstName = sanitize(body.firstName);
        body.lastName = sanitize(body.lastName);
        // ***need to add a way to check and change passwords***
        // body.password = sanitize(body.password);

        let employeeCollection: Collection<Employee> = mongoClient.db(DB_NAME).collection<Employee>(COLLECTION_EMPLOYEES);
        let selector:Object = { "employeeId": employeeId };
        let newValues:Object = { $set: { 
            firstName: body.firstName, 
            lastName: body.lastName, 
            admin: body.admin } };
        let result:UpdateResult = await employeeCollection.updateOne(selector, newValues);

        if (result.matchedCount <= 0 ) {
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
    } catch (error:any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    } finally {
        mongoClient.close();
    }
}