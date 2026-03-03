import { Collection, InsertOneResult, MongoClient, ObjectId, UpdateResult } from "mongodb";
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

        claimArray.forEach((claim:Claim) => claim._id = claim._id.toString());

        return NextResponse.json(
            {
                message: "All claims accessed",
                claims: claimArray
            },
            { status: 200 }
        );

    } catch (error:any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    } finally {
        mongoClient.close();
    }

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
 /** 
  * Adds a claim to the database with an 'open' status. Takes special conciderations sanitizing 'Travel' claims
  * @param request accepts json requests with the following format:
  * {
    "employeeId": "",
    "receipt": "",
    "amount": 0,
    "description": "",
    "category": {
        "name": "",
        // conditional data follows, do not include if not used by category
        "locationStart": "",
        "locationEnd": "",
        "distanceKm": 0
    }
}
 */
export async function createClaim(request: NextRequest) {
    let mongoClient: MongoClient = new MongoClient(URL);

    try {
        await mongoClient.connect();

        const body:any = await request.json();

        body.status = "open";
        body.employeeId = sanitize(body.employeeId);
        body.receipt = sanitize(body.receipt);
        body.amount = Number(sanitize(body.amount));
        body.description = sanitize(body.description);
        body.category.name = sanitize(body.category.name);        
        if (body.category.name === "Travel") {
            body.category.locationStart = sanitize(body.category.locationStart);
            body.category.locationEnd = sanitize(body.category.locationEnd);
            body.category.distanceKm = Number(sanitize(body.category.distanceKm));
        };

        let result: InsertOneResult = await mongoClient.db(DB_NAME).collection<Claim>(COLLECTION_CLAIMS).insertOne(body);

        return NextResponse.json(
            { 
                message: "New claim created",
                result 
            }, 
            { status: 200 }
        );
    } catch (error:any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );        
    } finally {
        mongoClient.close();
    }
}

/** 
 * Changes claim status based on submitted request
 * @param request accepts json requests with the following format:
 * { status: "" }
 * @param id used to serch db for a matching object id
*/
export async function changeClaimStatus(request: NextRequest, id: string) {
    let mongoClient: MongoClient = new MongoClient(URL);

    try {
        await mongoClient.connect();

        let claimId: ObjectId = new ObjectId(sanitize(id));

        const body: any = await request.json();
        const status = sanitize(body.status);

        let claimCollection: Collection<Claim> = mongoClient.db(DB_NAME).collection<Claim>(COLLECTION_CLAIMS);
        let selector: Object = { "_id": claimId };
        let newValue: Object = { $set: { status: status } };
        let result: UpdateResult = await claimCollection.updateOne(selector, newValue);

        
        if (result.matchedCount <= 0) {
            let error = `Claim ${claimId} not found`;

            return NextResponse.json(
                { error: error },
                { status: 404 , statusText: error}
            );
        } else {
            return NextResponse.json(
                {
                    message: `Status changed for claim: ${claimId}`,
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