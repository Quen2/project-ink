'use client';

import Navbar from "@/components/flow/navbar";
import ConnectedNavbar from "@/components/flow/connected-navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Appointment({params}) {
    const [projectType, setProjectType] = useState('')
    const [projectDetails, setProjectDetails] = useState(null)
    const [bodyPartChoice, setBodyPartChoice] = useState(null)
    const [fileName, setFileName] = useState("");
    const [artistPost, setArtistPost] = useState(null)
    const {data: session} = useSession()

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success('Demande prise en compte !');

    let uploadedImageNames = [];

    if (projectType === 'personal') {
      const files = document.getElementById('inputFile').files;
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      try {
        const uploadResponse = await axios.post('/api/upload-img', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        uploadedImageNames = uploadResponse.data.imagesNames;
      } catch (error) {
        console.log(error);
      }
    }

    try {
      await axios.post('/api/appointment', {
        userId: session.user._id,
        artistId: params.id,
        type: projectType,
        description: projectDetails,
        bodyPlacement: bodyPartChoice,
        images: uploadedImageNames,
        status: 1,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    axios
      .get(`/api/posts/find-by-authorId/${params.id}`)
      .then((response) => {
        setArtistPost(response.data.posts);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params]);

  return (
    <div>
      {projectType === '' && (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <h1 className="text-3xl mb-4">Choisis ton type de rendez-vous</h1>
          <button
            onClick={() => {
              setProjectType('personal');
            }}
            className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900"
          >
            Projet perso
          </button>
          <button
            onClick={() => {
              setProjectType('flash');
            }}
            className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900"
          >
            Tatouage flash
          </button>
        </div>
      )}
      {projectType === 'personal' && (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="bg-gray-200 p-8 rounded shadow-lg">
            <h1 className="text-3xl mb-4">Demande de projet perso</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <textarea
                placeholder="Décris ton projet (ajoute le plus de détails possible !)"
                className="bg-gray-600 text-white py-2 px-4 rounded resize-none"
                onChange={(e) => {
                  setProjectDetails(e.target.value);
                }}
              />
              <input
                type="text"
                placeholder="Partie du corps choisie"
                className="bg-gray-600 text-white py-2 px-4 rounded"
                onChange={(e) => {
                  setBodyPartChoice(e.target.value);
                }}
              />
              <input
                type="file"
                id="inputFile"
                multiple
                className="m-2 w-1/2"
              />
              <button
                type="submit"
                className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900"
              >
                Envoyer ma demande
              </button>
              <button
                onClick={() => {
                  setProjectType('');
                }}
                className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900"
              >
                Retour
              </button>
            </form>
          </div>
        </div>
      )}
      {projectType === 'flash' && (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="bg-gray-200 p-8 rounded shadow-lg">
            <h1 className="text-3xl mb-4">Choisis ton flash</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Partie du corps choisie"
                className="bg-gray-600 text-white py-2 px-4 rounded"
                onChange={(e) => {
                  setBodyPartChoice(e.target.value);
                }}
              />
              <p>Choisis ton flash</p>
              {artistPost
                ? artistPost.map((post) => (
                    <>
                      <Image
                        src={`/assets/${post.fileName}`}
                        className="cursor-pointer focus:border"
                        width={150}
                        height={150}
                      />
                    </>
                  ))
                : null}
              <button
                type="submit"
                className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900"
              >
                Envoyer ma demande
              </button>
              <button
                onClick={() => {
                  setProjectType('');
                }}
                className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900"
              >
                Retour
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
