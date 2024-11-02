"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function PostList({userId = null, searchFilter}) {
  const [posts, setPosts] = useState(null);
  const [emptyInput, setEmptyInput] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let response;
        if (userId) {
          response = await axios.get(`/api/posts/user/${userId.userId}`);
        } else {
          response = await axios.get("/api/posts");
        }
        setPosts(response.data.posts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
  }, [emptyInput, userId]);

  useEffect(() => {
    if (searchFilter === "") {
      setEmptyInput(!emptyInput);
    }

    axios
      .post("/api/posts/filters", {
        searchFilter,
      })
      .then((response) => {
        setPosts(response.data.posts);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [searchFilter]);

  return (
    <div>
      <div>
        <div className="bg-[#282828] flex justify-around flex-wrap text-white w-full gap-3">
          {posts ? (
            posts.length > 0 ? (
              posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/post/${post._id}`}
                  className="h-fit"
                >
                  <Image
                    alt="artist creation"
                    width={400}
                    height={Math.random() * (300 - 200) + 200}
                    src={`/assets/${post.fileName}`}
                    className="rounded-xl hover:opacity-60"
                  />
                </Link>
              ))
            ) : (
              <p>
                Vous n'avez encore rien posté. N'hésitez pas à commencer à nous partager votre savoir-faire !
              </p>
            )
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
