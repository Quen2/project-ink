import connectMongoDb from "@/libs/mongodb";
import Post from "@/models/posts";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { userId } = params;
    await connectMongoDb();
    const posts = await Post.find({ authorId: userId });
    return NextResponse.json({ posts });
}
