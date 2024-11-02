'use client';
import Navbar from '@/components/flow/navbar';
import ConnectedNavbar from '@/components/flow/connected-navbar';
import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Create_post() {
  const [postTitle, setPostTitle] = useState(null);
  const [tatooStyle, setTatooStyle] = useState('cartoon');
  const [doneCreating, setDoneCreating] = useState(false);
  const [newPostId, setNewPostId] = useState(null);
  const [localisation, setLocalisation] = useState(null);
  const [description, setDescription] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();

  async function createPost(e) {
    e.preventDefault();
    const file = document.getElementById('inputFile').files[0];
    const formData = new FormData();

    formData.append('file', file);

    const uploadResponse = await axios.post('/api/upload-img', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    axios
      .post('/api/posts', {
        title: postTitle,
        style: tatooStyle,
        trueFileName: uploadResponse.data.imagesNames[0],
        authorId: session.user._id,
      })
      .then((response) => {
        setNewPostId(response.data.newPost._id);
        toast.success('Votre post a bien été crée'),
          setDoneCreating(!doneCreating);
      })
      .catch((error) => console.log(error));
  }

  function updatePost(e) {
    e.preventDefault();
    axios
      .put('/api/posts/update-post', {
        localisation: localisation,
        description: description,
        id: newPostId,
      })
      .then(() => {
        toast.success('Votre post est bien à jour');
        setTimeout(() => {
          router.push(`/post/${newPostId}`);
        }, 1000);
      })
      .catch((error) => console.log(error));
  }

  return (
    <div>
      {session ? <ConnectedNavbar /> : <Navbar />}
      {doneCreating ? (
        <div className="modal">
          <div>
            <form
              className="flex flex-col justify-center"
              onSubmit={updatePost}
            >
              <input
                placeholder="Localisation"
                type="text"
                className="m-2 w-1/2 text-black"
                onChange={(e) => {
                  setLocalisation(e.target.value);
                }}
              />
              <input
                type="test"
                className="m-2 w-1/2 text-black"
                placeholder="Description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
              <button type="submit" className="p-2 text-white">
                Mettre à jouer le post
              </button>
            </form>
            <Link href="/post-list">Ignorer pour le moment</Link>
          </div>
        </div>
      ) : null}
      <div className="text-center py-4">
        <Link href="/post-list">Revoir les posts</Link>
      </div>
      <div className="bg-[#282828] text-white w-3/4 mx-auto rounded-xl">
        <p className="text-center">Créer un post</p>
        <form className="flex flex-col justify-center" onSubmit={createPost}>
          <input
            placeholder="Titre"
            type="text"
            className="m-2 w-1/2 text-black"
            onChange={(e) => {
              setPostTitle(e.target.value);
            }}
          />
          <select
            className="text-black w-1/2 m-2"
            onChange={(e) => {
              setTatooStyle(e.target.value);
            }}
          >
            <option value="cartoon">Cartoon</option>
            <option value="old-school">Old school</option>
            <option value="realist">Réaliste</option>
            <option value="cover">Cover</option>
            <option value="floral">Floral</option>
          </select>
          <input
            type="file"
            id="inputFile"
            className="m-2 w-1/2"
          />
          <button type="submit" className="p-2 text-white">
            Créer le post
          </button>
        </form>
      </div>
    </div>
  );
}
