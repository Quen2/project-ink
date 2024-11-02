'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faFeather } from '@fortawesome/free-solid-svg-icons';
import PostList from '@/components/flow/post-list';
import { useState } from 'react';
import Link from 'next/link';
import ModalPostList from './modal-post-list';

export default function Navbar() {
  const [searchFilter, setSearchFilter] = useState('');

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
            <Link href="/">Ink</Link>
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
            <Link href="/login">Se connecter</Link>
          </button>
          <button className="bg-[#E9E9E9] rounded-3xl p-3 text-black">
            <Link href="/sign-in">S'inscrire</Link>
          </button>
        </div>
      </div>
      <div className="mobile md:hidden">
        <Link href="/">
          <p className="text-center p-4">Ink.</p>
        </Link>
        <div className="fixed bottom-0 md:hidden bg-white flex justify-between p-4 w-full border">
          <div className="flex flex-col w-1/2 h-full text-center">
            <Link href="/login">
              <FontAwesomeIcon icon={faUser} />
            </Link>
            <p className="text-[10px]">Se connecter</p>
          </div>
          <div className="flex flex-col w-1/2 text-center">
            <Link href="/sign-in">
              <FontAwesomeIcon icon={faFeather} />
            </Link>
            <p className="text-[10px]">Créer un compte</p>
          </div>
        </div>
      </div>
    </div>
  );
}
