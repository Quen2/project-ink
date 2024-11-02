'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/flow/navbar';
import ConnectedNavbar from '@/components/flow/connected-navbar';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ConfirmationModal from '@/components/flow/confirmation-modal';

export default function Post({ params }) {
  const { id } = params;
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [post, setPost] = useState(null);
  const [postContent, setPostContent] = useState(null);
  const [seeComment, setSeeComment] = useState(false);
  const [posted, setPosted] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState(null);
  const [doneUpdating, setDoneUpdating] = useState(false);
  const [author, setAuthor] = useState(null);
  const [isAFollower, setIsAFollower] = useState(null);
  const [doneUnfollow, setDoneUnfollow] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`/api/posts/${id}`)
      .then((res) => {
        setPost(res.data.posts);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [posted, doneUpdating, doneUnfollow]);

  useEffect(() => {
    if (post) {
      axios
        .get(`/api/user/${post.authorId}`)
        .then((res) => {
          setAuthor(res.data.user);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [post, doneUnfollow]);

  useEffect(() => {
    if (author) {
      setIsAFollower(
        author.followers.some(
          (follower) => follower.userId === session.user._id
        )
      );
    }
  }, [author]);

  function changeDate(date) {
    const newDate = new Date(date).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return newDate;
  }

  function postComment(e) {
    e.preventDefault();

    axios
      .post('/api/posts/post-comment', {
        authorId: post.authorId,
        comment: postContent,
        postId: post._id,
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setPosted(!posted);
      });
  }

  function editPost(e) {
    e.preventDefault();

    axios
      .put(`/api/posts/${id}`, {
        title: updatedTitle,
      })
      .then(() => {
        toast.success('Vos modifications sont bien prises en compte !');
        setTimeout(() => {
          setIsUpdating(!isUpdating);
          setDoneUpdating(!doneUpdating);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deletePost() {
    axios
      .delete(`/api/posts/${id}`)
      .then(() => {
        toast.success('Votre post à bien été supprimé !');
        setTimeout(() => {
          router.push('/post-list');
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function followUser() {
    axios
      .post(`/api/user/follow-user`, {
        authorId: author._id,
        userId: session.user._id
      })
      .then((res) => {
        console.log(res);
        setDoneUnfollow(!doneUnfollow);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function unfollowerUser() {
    axios
      .post(`/api/user/unfollow-user`, {
        authorId: author._id,
        userId: session.user._id
      })
      .then((res) => {
        console.log(res);
        setDoneUnfollow(!doneUnfollow);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      {session ? <ConnectedNavbar /> : <Navbar />}
      <div className="bg-[#282828] text-white">
        <p className="text-center py-2 w-3/4 mx-auto bg-[#353535] hidden md:block ">
          Partager cette page
        </p>
        {isUpdating ? (
          <div className="modal">
            <div>
              <p
                onClick={() => {
                  setIsUpdating(!isUpdating);
                }}
                className="cursor-pointer text-center"
              >
                Annuler
              </p>
              <form onSubmit={editPost} className="flex flex-col">
                <input
                  type="text"
                  className="text-black"
                  defaultValue={post.title}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                />
                <button type="submit">Modifier</button>
              </form>
            </div>
          </div>
        ) : null}
        {isDeleting && (
          <>
            <ConfirmationModal
              message={'Êtes-vous sûr de vouloir supprimer votre post ?'}
              onConfirm={deletePost}
              onClose={setIsDeleting}
            />
          </>
        )}
        {post ? (
          <div className="bg-[#353535] md:w-3/4 mx-auto mt-6 p-2 rounded-lg md:flex gap-4 relative">
            <Link
              className="absolute ml-2 mt-2 font-bold bg-white text-black rounded-full px-1"
              href="/post-list"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
            <Image
              width={400}
              height={250}
              alt="artist creation"
              src={`/assets/${post.fileName}`}
              className="w-full md:w-1/2 rounded-xl"
            />
            <div className="md:w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex flex-col justify-center">
                  {author &&
                  author._id !== session.user._id ? (
                    <div className="flex md:flex-col justify-around  bg-[#282828] text-white">
                      <Link href={`/profile/${author._id}`}>
                        {author.pseudo}
                      </Link>
                      {isAFollower ? (
                        <p onClick={unfollowerUser}>Ne plus suivre</p>
                      ) : (
                        <p onClick={followUser} className="cursor-pointer">
                          {' '}
                          Suivre{' '}
                        </p>
                      )}
                    </div>
                  ) : null}
                  <p>{post.title} </p>
                </div>
                {author &&
                author._id === session.user._id ? (
                  <div className="flex justify-between">
                    <p
                      onClick={() => {
                        setIsUpdating(!isUpdating);
                      }}
                      className="cursor-pointer"
                    >
                      Modifier
                    </p>
                    <p
                      onClick={() => {
                        setIsDeleting(!isDeleting);
                      }}
                      className="cursor-pointer"
                    >
                      Supprimer
                    </p>
                  </div>
                ) : null}
                <p
                  onClick={() => setSeeComment(!seeComment)}
                  className="cursor-pointer"
                >
                  Commentaires
                </p>
              </div>
              {seeComment === true
                ? post.comment.map((comment, index) => (
                    <div key={index} className="flex gap-4">
                      <p>{comment.comment}</p>
                    </div>
                  ))
                : null}
              <div>
                <form onSubmit={postComment}>
                  <input
                    type="text"
                    className="text-black"
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                  <button type="submit">Poster</button>
                </form>
                <p className="text-sm">
                  Publié le {changeDate(post.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
