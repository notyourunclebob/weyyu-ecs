import { Collection, MongoClient } from "mongodb";
import { Claim } from "./claim.model";
import { NextRequest, NextResponse } from "next/server";
import sanitize from "sanitize-html";


const URL: string = process.env.DB_URL || "mongodb://mongo:27017/";
const DB_NAME: string = "ecsdb";
const COLLECTION_CLAIMS: string = "claims";

/** 
 * When called will query database and return a list of all claim data
*/
export async function getClaimsAll() {
    let mongoClient: MongoClient = new MongoClient(URL);
    let claimArray: Claim[];

    try {
        await mongoClient.connect();

        claimArray = await mongoClient.db(DB_NAME).collection<Claim>(COLLECTION_CLAIMS).find().toArray();

        claimArray.forEach((claim: Claim) => claim._id = claim._id.toString());
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
            message: "Claims accessed",
            claims: claimArray
        },
        { status: 200 }
    );
}

/** 
 * When called will query database and return a list of all claims for a single employee
 * @param request returned claims will match the employeeId. ex: { employeeId: "EC#4861258765" }
*/
export async function getClaimsEmployee(request: NextRequest) {
    let mongoClient: MongoClient = new MongoClient(URL);
    let claimArray: Claim[];

    try {
        await mongoClient.connect();

        const body: any = await request.json();

        body.employeeId = sanitize(body.employeeId);

        let selector: Object = { "employeeId": body.employeeId };
        claimArray = await mongoClient.db(DB_NAME).collection<Claim>(COLLECTION_CLAIMS).find(selector).toArray();

        claimArray.forEach((claim: Claim) => claim._id = claim._id.toString());

        if (claimArray.length === 0) {
            let error = `No claims for ${body.employeeId} found`;

            return NextResponse.json(
                { error: error },
                { status: 404, statusText: error }
            );
        } else {
            return NextResponse.json(
                {
                    message: `Claims accessed for ${body.employeeId}`,
                    claims: claimArray
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