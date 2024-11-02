import connectMongoDb from '@/libs/mongodb';
import User from '@/models/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function GET(request, { params }) {
  const { id } = params;

  await connectMongoDb();

  const user = await User.findOne({ _id: id });

  return NextResponse.json({ user });
}

export async function PUT(request, { params }) {
  const { id } = params;

  try {
    let {
      pseudo,
      email,
      phoneNumber,
      birthDate,
      password,
      address,
      siret,
      biography,
      profilePicture,
      iban,
      bic,
      lastname,
      firstname,
      isArtist,
    } = await request.json();

    if (isArtist && siret && !isSiretNumber(siret)) {
      return NextResponse.json(
        { message: 'Numéro SIRET invalide' },
        { status: 400 }
      );
    }

    let data = {
      pseudo,
      email,
      phoneNumber,
      birthDate,
      address,
      siret,
      biography,
      profilePicture,
      payment: [
        {
          iban: iban,
          bic: bic,
          firstname: firstname,
          lastname: lastname,
        },
      ],
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      data.password = hash;
    }

    await connectMongoDb();
    const user = await User.findByIdAndUpdate(id, data);

    return NextResponse.json(
      { message: 'Profil mis à jour ! 😀' },
      { user },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  await connectMongoDb();
  await User.findOneAndDelete({ _id: id });

  return NextResponse.json({ message: 'Votre compte a bien été supprimé.' });
}

function isSiretNumber(number) {
  return isNaN(number) || number.length != 14 ? false : true;
}
