import { Collection, DeleteResult, InsertOneResult, MongoClient, ObjectId, UpdateResult } from "mongodb";
import { CategoryBase } from "./categoryBase.model";
import { NextRequest, NextResponse } from "next/server";
import sanitize from "sanitize-html";

const URL: string = process.env.DB_URL || "mongodb://mongo:27017/";
const DB_NAME: string = "ecsdb";
const COLLECTION_CATEGORIES: string = "categories";

/** 
 * When called will query database and return a list of all category data
*/
export async function getCategories() {
    let mongoClient: MongoClient = new MongoClient(URL);

    let categoryArray: CategoryBase[];

    try {
        await mongoClient.connect();

        categoryArray = await mongoClient.db(DB_NAME).collection<CategoryBase>(COLLECTION_CATEGORIES).find().toArray();

        categoryArray.forEach((category: CategoryBase) => category._id = category._id.toString());
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
            message: "Categories accessed",
            categories: categoryArray
        },
        { status: 200 }
    );
}

/** 
 * Adds a new category to the database. New categories will always have no additional requirements and allow for editing.
 * @param request accepts json requests with the following format:
 * { "name": "" }
*/
export async function createCategory(request: NextRequest) {
    let mongoClient: MongoClient = new MongoClient(URL);

    try {
        await mongoClient.connect();

        const body: any = await request.json();

        body.name = sanitize(body.name);
        body.allowChange = true;
        body.requirements = { requierment: "none" };

        let result: InsertOneResult = await mongoClient.db(DB_NAME).collection<CategoryBase>(COLLECTION_CATEGORIES).insertOne(body);

        return NextResponse.json(
            {
                message: `Created new category: ${body.name}`,
                result
            },
            { status: 200 },
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
 * Changes category if it is editable
 * @param request accepts json requests with the following format:
 * { name: "" }
 * @param id used to serch db for a matching object id
*/
export async function editCategory(request: NextRequest, id: string) {
    let mongoClient: MongoClient = new MongoClient(URL);

    try {
        await mongoClient.connect();

        let categoryId: ObjectId = new ObjectId(sanitize(id));

        let categoryCollection: Collection<CategoryBase> = mongoClient.db(DB_NAME).collection<CategoryBase>(COLLECTION_CATEGORIES);
        let selector: Object = { "_id": categoryId };
        let result: any = await categoryCollection.findOne(selector);

        if (result && result.allowChange == true) {
            const body: any = await request.json();
            const name = sanitize(body.name);

            let newValue: Object = { $set: { name: name } };
            let updatResult: UpdateResult = await categoryCollection.updateOne(selector, newValue);

            return NextResponse.json(
                {
                    message: `Name changed for category _id: ${categoryId}, from: ${result.name} to: ${name}`,
                    updatResult
                },
                { status: 200 }
            );

        } else if (result && result.allowChange == false) {
            let error = `Category _id: ${categoryId}, ${result.name} cannot be changed`
            return NextResponse.json(
                { error: error },
                { status: 500, statusText: error }
            );

        } else {
            let error = `Category ${categoryId} not found`
            return NextResponse.json(
                { error: error },
                { status: 404, statusText: error }
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
 * Deletes the category with the matching id
 * @param request Reqest used to identify the category _id to delete with the following format:
 * { _id: "" }
*/
export async function deleteCategory(request: NextRequest) {
    let mongoClient: MongoClient = new MongoClient(URL);

    try {
        await mongoClient.connect();

        const body: any = await request.json();

        let categoryId: ObjectId = new ObjectId(sanitize(body._id));
        let categoryCollection: Collection<CategoryBase> = mongoClient.db(DB_NAME).collection<CategoryBase>(COLLECTION_CATEGORIES);
        let selector: Object = { "_id": categoryId };
        let result: any = await categoryCollection.findOne(selector);

        if (result && result.allowChange == true) {
            let deleteResult: DeleteResult = await categoryCollection.deleteOne(selector);

            if (deleteResult.deletedCount <= 0) {
                let error = `Category _id: ${categoryId} failed to delete`
                return NextResponse.json(
                    { error: error },
                    { status: 500, statusText: error }
                );
            } else {
                return NextResponse.json(
                    {
                        message: `Category _id: ${categoryId} successfully deleted`,
                        deleteResult
                    },
                    { status: 200 }
                );
            }

        } else if (result && result.allowChange == false) {
            let error = `Category _id: ${categoryId}, ${result.name} cannot be deleted`
            return NextResponse.json(
                { error: error },
                { status: 500, statusText: error }
            );

        } else {
            let error = `Category ${categoryId} not found`
            return NextResponse.json(
                { error: error },
                { status: 404, statusText: error }
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
 * Takes a category id and returns the category object
 * @param id the id of the requested category
 * @returns category object
 * @author Drew MacEachern
 */
export async function getCategoryById(id: string) {
    let mongoClient: MongoClient = new MongoClient(URL);
    let categoryId: ObjectId = new ObjectId(sanitize(id));
    let result: any;

    try {
        await mongoClient.connect();

        let categoryCollection: Collection<CategoryBase> = mongoClient
            .db(DB_NAME)
            .collection<CategoryBase>(COLLECTION_CATEGORIES);

        let selector: Object = { "_id": categoryId };
        result = await categoryCollection.findOne(selector);

        if (result) {
            result._id = result._id.toString();
        }
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
            message: "Category accessed",
            categories: result
        },
        { status: 200 }
    );
}