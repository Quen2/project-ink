import connectMongoDb from '@/libs/mongodb';
import Post from '@/models/posts';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;

  await connectMongoDb();

  const posts = await Post.findOne({ _id: id });

  return NextResponse.json({ posts });
}

export async function PUT(request, { params }) {
  const { id } = params;
  const { title } = await request.json();

  await connectMongoDb();
  await Post.findByIdAndUpdate(id, { title });

  return NextResponse.json({ message: 'Post mis à jour' }, { status: 200 });
}

export async function DELETE(request, { params }) {
  const { id } = params;

  await connectMongoDb();
  await Post.findByIdAndDelete(id);
  
  return NextResponse.json({ message: 'Post supprimé' }, { status: 200 });
}
