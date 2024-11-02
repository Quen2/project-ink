'use client';
import Navbar from '@/components/flow/navbar';
import ConnectedNavbar from '@/components/flow/connected-navbar';
import PostList from '@/components/flow/post-list';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Post_list() {
  const { data: session } = useSession();
  const [searchFilter, setSearchFilter] = useState('');

  return (
    <div>
      {session ? <ConnectedNavbar /> : <Navbar />}
      <div className="text-center py-4 bg-[#282828] text-white flex flex-col">
        {session && session.user.isArtist === true ? (
          <Link href="/create-post">Créer un post</Link>
        ) : null}
      </div>
      <div>
        <PostList searchFilter={searchFilter} />
      </div>
    </div>
  );
}
