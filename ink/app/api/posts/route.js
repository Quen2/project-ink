import connectMongoDb from '@/libs/mongodb';
import Post from '@/models/posts';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const data = await req.json();
  const { title, style, trueFileName, authorId } = data;
  const fileName = trueFileName.split('\\').pop();

  await connectMongoDb();

  const newPost = await Post.create({ title, style, fileName, authorId });

  return NextResponse.json({ newPost });
}

export async function GET() {
  await connectMongoDb();

  const posts = await Post.find();
  
  return NextResponse.json({ posts });
}
