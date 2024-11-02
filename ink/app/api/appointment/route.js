import connectMongoDb from '@/libs/mongodb';
import Appointments from '@/models/appointments';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { userId, artistId, type, description, bodyPlacement, images, status } =
    await request.json();

  await connectMongoDb();

  const newPost = await Appointments.create({
    userId,
    artistId,
    type,
    description,
    bodyPlacement,
    status,
    images,
  });

  await newPost.save();

  return NextResponse.json({ message: 'Utilisateur suivi' }, { status: 201 });
}
