import connectMongoDb from '@/libs/mongodb';
import User from '@/models/user';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req) {
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
  } = await req.json();

  if (isArtist && siret && !isSiretNumber(siret)) {
    return NextResponse.json(
      { message: 'Numéro SIRET invalide' },
      { status: 400 }
    );
  }

  try {
    let data = {
      pseudo,
      email,
      phoneNumber,
      birthDate,
      address,
      siret,
      biography,
      profilePicture,
      isArtist,
      payment: [
        {
          iban: iban,
          bic: bic,
          firstname: firstname,
          lastname: lastname,
        },
      ],
    };

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    data.password = hash;

    await connectMongoDb();
    const user = await User.create(data);

    return NextResponse.json(
      { message: 'Inscription terminée, bienvenue sur Ink. 😀', user },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Une erreur est survenue lors de l'inscription." },
      { status: 500 }
    );
  }
}

function isSiretNumber(number) {
  return isNaN(number) || number.length != 14 ? false : true;
}
