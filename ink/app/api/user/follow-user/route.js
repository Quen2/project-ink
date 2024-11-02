import connectMongoDb from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { 
        userId,
        authorId
    } = await request.json();
    await connectMongoDb();
    const author = await User.findByIdAndUpdate(authorId)
    const user = await User.findById(userId)
    author.followers.push({
        userId: user._id,
        pseudo: user.pseudo,
        profilePicture: 'test'
    })
    await author.save()
    return NextResponse.json({message : 'Utilisateur suivi'}, {status : 201})

}