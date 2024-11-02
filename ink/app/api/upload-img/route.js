import { NextResponse } from 'next/server';
import path from 'path';
import { writeFileSync, unlinkSync } from 'fs';

export const POST = async (req, res) => {
  // recupère les images de la requête
  const formData = await req.formData();
  // tableau de noms d'images à renvoyer au front
  let imagesNames = [];
  // récupère le nom de l'ancienne PP quand c'est un update de profil
  let oldProfilePicture = formData.get('oldProfilePicture');

  // supprime des données l'ancienne PP pour ne pas casser la map en dessous
  formData.delete('oldProfilePicture');

  // Si il y a une ancienne PP on la supprime pour vider le stockage des images inutiles
  if (oldProfilePicture && oldProfilePicture !== 'default.png') {
    deleteFile(oldProfilePicture);
  }

  try {
    // permet de finir totalement l'enregistrement des images avant d'envoyer au front le tableau
    await Promise.all(
      // map sur les images
      Array.from(formData.entries()).map(async ([name, file]) => {
        // On convertit l'image en binaire afin de récupérer et copier ses informations
        const buffer = Buffer.from(await file.arrayBuffer());
        // Recupère l'extension du fichier
        const extension = file.name.split('.').pop();
        // Nom unique pour les images (timestamp)
        const fileName = Date.now();
        // Indente le nouveau nom avec l'extension pour la garder lisible par le front
        const completeName = `${fileName}.${extension}`;

        imagesNames.push(completeName);

        // Sauvegarde dans assets l'image
        writeFileSync(
          // Chemin vers la nouvelle image
          path.join(process.cwd(), 'public/assets/' + completeName),
          // Données de l'image en binaire
          buffer
        );
      })
    );

    return NextResponse.json({
      Message: 'Success',
      status: 201,
      imagesNames,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ Message: 'Failed', status: 500 });
  }
};

const deleteFile = (fileName) => {
  try {
    // Chemin vers l'ancienne PP
    const filePath = path.join(process.cwd(), 'public/assets/', fileName);

    // Supprime l'ancienne PP
    unlinkSync(filePath);
  } catch (error) {
    console.error(error);
  }
};
