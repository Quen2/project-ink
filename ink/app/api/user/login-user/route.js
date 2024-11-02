import connectMongoDb from '@/libs/mongodb';
import User from '@/models/user';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pseudo = searchParams.get('pseudo');

    if (!pseudo) {
      return NextResponse.json(
        { message: 'Erreur sur le pseudo' },
        { status: 400 }
      );
    }

    await connectMongoDb();
    const user = await User.findOne({ pseudo });

    if (!user) {
      return NextResponse.json(
        { message: 'Utilisateur introuvable' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { userId: user._id, userArtist: user.isArtist },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const { pseudo, password } = await req.json();
  await connectMongoDb();
  try {
    const user = await User.findOne({ pseudo: pseudo });
    if (!user) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé.' },
        { status: 404 }
      );
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: 'Mot de passe incorrect.' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { message: `Bienvenue ${user.pseudo}`, user },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de l'authentification." },
      { status: 500 }
    );
  }
}
