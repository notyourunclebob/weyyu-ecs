import { Collection, Filter, InsertOneResult, MongoClient, ObjectId, UpdateResult, WithId } from "mongodb";
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

        return NextResponse.json(
            {
                message: "All claims accessed",
                claims: claimArray
            },
            { status: 200 }
        );

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
   "comment": "",
   "category": {
       "name": "",
       // conditional data follows, do not include if not used by category
       "locationStart": "",
       "locationEnd": "",
       "distanceKm": 0
   }
}
*/
export async function createClaim(request: NextRequest, userId: string) {
    let mongoClient: MongoClient = new MongoClient(URL);

    try {
        await mongoClient.connect();

        const body: any = await request.json();


        body.date = sanitize(body.date);
        body.status = "pending";
        body.employeeId = sanitize(userId);
        body.receipt = sanitize(body.receiptUrl);
        body.amount = Number(sanitize(body.amount));
        body.description = sanitize(body.description);
        body.category = sanitize(body.category);
        if (body.category === "Travel") {
            console.log("in travel if");
            body.locationStart = sanitize(body.startLocation);
            body.locationEnd = sanitize(body.endLocation);
            body.mileage = sanitize(body.mileage);
        } else if (body.category === "Medical") {
            body.faceHugger = sanitize(body.facehugger);
        };

        let result: InsertOneResult = await mongoClient.db(DB_NAME).collection<Claim>(COLLECTION_CLAIMS).insertOne(body);

        return NextResponse.json(
            {
                message: "New claim created",
                result
            },
            { status: 200 }
        );
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
 * Changes claim status based on submitted request
 * @param request accepts json requests with the following format:
 * { status: "", comment: "" }
 * @param id used to serch db for a matching object id
*/
export async function changeClaimStatus(request: NextRequest, id: string) {
    let mongoClient: MongoClient = new MongoClient(URL);

    try {
        await mongoClient.connect();

        let claimId: ObjectId = new ObjectId(sanitize(id));

        const body: any = await request.json();
        const status = sanitize(body.status);
        const comment = sanitize(body.comment);

        let claimCollection: Collection<Claim> = mongoClient.db(DB_NAME).collection<Claim>(COLLECTION_CLAIMS);
        let selector: Object = { "_id": claimId };
        let newValue: Object = { $set: { status: status, coment: comment } };
        let result: UpdateResult = await claimCollection.updateOne(selector, newValue);


        if (result.matchedCount <= 0) {
            let error = `Claim ${claimId} not found`;

            return NextResponse.json(
                { error: error },
                { status: 404, statusText: error }
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
 * Queries the database for the claim associated with the claim id and employee id
 * @param claim_id The id of the sought after claim
 * @param employee_id The id of the user which the claim was made by
 * @returns Claim data
 * @author Drew MacEachern
 */
export async function getClaimById(claim_id: string) {
    let mongoClient: MongoClient = new MongoClient(URL);

    try {

        await mongoClient.connect();

        let claimId: ObjectId = new ObjectId(claim_id.trim());

        const claim = await mongoClient.db(DB_NAME).collection<Claim>(COLLECTION_CLAIMS).findOne({ "_id": claimId });

        if (!claim) {
            return { error: "Not found or unauthorized" };
        }

        claim._id = claim._id.toString();
        return claim;

    } catch (error: any) {
        return { error: error.message };
    } finally {
        mongoClient.close();
    }
}