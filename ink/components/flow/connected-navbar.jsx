'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { faUser, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import PostList from '@/components/flow/post-list';
import ModalPostList from './modal-post-list';

export default function ConnectedNavbar() {
  const { data: session } = useSession();
  const [searchFilter, setSearchFilter] = useState('');

  async function logout() {
    await signOut({
      redirect: true,
      callbackUrl: '/',
    });
  }

  return (
    <div>
      {searchFilter !== '' ? (
        <div className='modalpost'>
          <div>
            <p onClick={() => {setSearchFilter('')}} className='text-white'>X</p>
            <ModalPostList searchFilter={searchFilter} />
          </div>
        </div>
      ) : null}
      <div className="desktop bg-[#282828] text-white justify-between p-2 hidden md:flex">
        <div className="burger flex gap-4">
          <div className="p-3">
            <Link href="/post-list">Ink</Link>
          </div>
          <button className="bg-[#E9E9E9] rounded-3xl p-3 text-black">
            <Link href="/post-list">Explorer</Link>
          </button>
        </div>
        <input
          type="text"
          className="w-2/3 mx-auto text-black border border-[#282828] pl-3 outline outline-transparent rounded-3xl z-50"
          placeholder="Rechercher"
          onChange={(e) => {
            setSearchFilter(e.target.value);
          }}
        />
        <div className="burger flex gap-4">
          <button className="bg-[#141414] text-white rounded-3xl p-3">
            <Link href={`/profile/${session.user._id}`}>Voir son profil</Link>
          </button>
          <button className="bg-[#E9E9E9] text-black rounded-3xl p-3">
            <p onClick={logout} className="cursor-pointer">
              Se déconnecter
            </p>
          </button>
        </div>
      </div>
      <div className="mobile md:hidden">
        <Link href="/">
          <p className="text-center p-4">Ink.</p>
        </Link>
        <div className="fixed bottom-0 md:hidden bg-white flex justify-between p-4 w-full border">
          <div className="flex flex-col w-1/2 h-full text-center">
            <Link href={`/profile/${session.user._id}`}>
              <FontAwesomeIcon icon={faUser} />
            </Link>
            <p className="text-[10px]">Voir son profil</p>
          </div>
          <div className="flex flex-col w-1/2 text-center">
            <p onClick={logout}>
              <FontAwesomeIcon icon={faDoorOpen} />
            </p>
            <p className="text-[10px] cursor-pointer">Se déconnecter</p>
          </div>
        </div>
      </div>
    </div>
  );
}
