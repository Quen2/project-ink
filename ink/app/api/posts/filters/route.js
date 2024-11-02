import connectMongoDb from "@/libs/mongodb";
import Post from "@/models/posts";
import { NextResponse } from "next/server";

export async function POST (req) {

    const filters = await req.json();
    let filter = filters.searchFilter;
    filter = !filter ? 'cartoon': filter
    const posts = await Post.find({
        "$or" : [
            {
                "title" : { "$regex" : filter, "$options" : "i"}
            }, {
                "style" : { "$regex" : filter, "$options" : "i"}
            }, {
                "authorId" : { "$regex" : filter, "$options" : "i"}
            }
        ]
    })
    return NextResponse.json({posts})

}