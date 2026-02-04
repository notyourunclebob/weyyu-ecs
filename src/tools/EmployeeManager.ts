import { Collection, MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import sanitize from "sanitize-html";
import { Employee } from "./employee.model";
import { verifyPass } from "./PassTools";

const URL: string = process.env.DB_URL || "mongodb://mongo:27017/";
const DB_NAME: string = "ecsDb";
const COLLECTION_EMPLOYEES: string = "employees";

/** 
 * Makes a request to query the db for a matching employeeId then checks the password to validate login.
 * Returns a json response with a message for access logs and employee data.
 * @param request uses a next request { employeeId: "", password: "" } to verify credentials.
*/
export async function employeeLogin(request: NextRequest) {
    let mongoClient: MongoClient = new MongoClient(URL);

    try {
        await mongoClient.connect();

        const body: any = await request.json();
        body.employeeId = sanitize(body.employeeId);
        body.password = sanitize(body.password);

        let employeeCollection: Collection<Employee> = mongoClient.db(DB_NAME).collection<Employee>(COLLECTION_EMPLOYEES);
        let employee: Employee | null = await employeeCollection.findOne({ employeeId: body.employeeId });

        // bad username
        if (!employee) {
            const response = NextResponse.json(
                { error: "Failed login attempt: Invalid ID" },
                { status: 401, statusText: "Bad credentials" }
            );
            console.log(response);
            return response;
        }

        const isVerified = await verifyPass(body.password, employee.password);

        // bad password
        if (!isVerified) {
            return NextResponse.json(
                { error: "Failed login attempt: Password" },
                { status: 401, statusText: "Bad credentials" }
            );
        }

        // employee data sent on a successful login
        const user = {
            employeeId: employee.employeeId,
            firstName: employee.firstName,
            lastName: employee.lastName,
            admin: employee.admin
        }

        if (employee.admin == true) {
            return NextResponse.json(
                {
                    message: `Login success admin: ${employee.employeeId} ${employee.firstName} ${employee.lastName}`,
                    user: user
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                {
                    message: `Login success: ${employee.employeeId} ${employee.firstName} ${employee.lastName}`,
                    user: user
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

// returns a list of all employee data
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