import connectMongoDb from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { 
        userId,
        authorId
    } = await request.json();
    await connectMongoDb();
    const user = await User.findByIdAndUpdate(
        authorId, 
        { $pull : { followers: { userId: userId} } },
        { new : true})
    await user.save()
    return NextResponse.json({message : 'Utilisateur unfollow'}, {status : 201})

}