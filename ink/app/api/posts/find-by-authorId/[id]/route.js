import connectMongoDb from "@/libs/mongodb";
import Post from "@/models/posts";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    const { id } = params
    await connectMongoDb();
    const posts = await Post.find({authorId : id});
    return NextResponse.json({posts});
}
