import connectMongoDb from "@/libs/mongodb";
import Post from "@/models/posts";
import { NextResponse } from "next/server";

export async function POST (req) {

    const data = await req.json();
    const post = await Post.findById(data.postId)
    post.comment.push(data)
    await post.save()
    return NextResponse.json({message : 'Commentaire crée'}, {status : 201})

}