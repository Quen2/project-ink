import connectMongoDb from "@/libs/mongodb";
import Post from "@/models/posts";
import { NextResponse } from "next/server";


export async function PUT(request) {
    const { localisation, description, id } = await request.json();
    await connectMongoDb();
    await Post.findByIdAndUpdate(id, {localisation: localisation, description: description})
    return NextResponse.json({message: "Post mis à jour"}, { status: 200});
}