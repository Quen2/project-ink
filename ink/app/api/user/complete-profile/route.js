import connectMongoDb from "@/libs/mongodb";
import User from "@/models/user";
import bcrypt from 'bcrypt';
import { NextResponse } from "next/server";

export async function PUT(req) {  
    try {
        const { 
            id,
            pseudo,
            email,
            phoneNumber,
            birthDate,
            isArtist,
            password,
            address,
            siret
        } = await req.json();

        if (isArtist && siret && !isSiretNumber(siret)) {
            return NextResponse.json({ message: "Numéro SIRET invalide" }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await connectMongoDb();
        await User.findByIdAndUpdate(
            id, 
            {
                pseudo, 
                email, 
                phoneNumber, 
                birthDate,
                password: hash,
                address,
                siret
            }
        );

        return NextResponse.json({ message: 'Profil complété ! 😀' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Erreur lors de la mise à jour du profil" }, { status: 500 });
    }
}

function isSiretNumber(number) {
    return isNaN(number) || number.length != 14 ? false : true
    // if (isNaN(number) || number.length != 14) return false;
    // let bal = 0;
    // let total = 0;
    // for (let i = 14 - 1; i >= 0; i--) {
    //     let step = (number.charCodeAt(i) - 48) * (bal + 1);
    //     total += (step > 9) ? step - 9 : step;
    //     bal = 1 - bal;
    // }
    // return (total % 10 == 0) ? true : false;
}
