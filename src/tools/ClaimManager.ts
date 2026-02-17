import { Collection, MongoClient } from "mongodb";
import { Claim } from "./claim.model";
import { NextResponse } from "next/server";


const URL: string = process.env.DB_URL || "mongodb://mongo:27017/";
const DB_NAME: string = "ecsDb";
const COLLECTION_CLAIMS: string = "claims";

export async function getClaimsAll() {
    let mongoClient: MongoClient = new MongoClient(URL);

    let claimArray: Claim[];

    try{
        await mongoClient.connect();

        claimArray = await mongoClient.db(DB_NAME).collection<Claim>(COLLECTION_CLAIMS).find().toArray();

        claimArray.forEach((claim:Claim) => claim._id = claim._id.toString());
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
            message: "Claims accessed",
            claims: claimArray
        },
        { status: 200 }
    );
}