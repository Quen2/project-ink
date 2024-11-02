'use client';

import Navbar from '@/components/flow/navbar';
import ConnectedNavbar from '@/components/flow/connected-navbar';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="body bg-[#282828]">
      {session ? <ConnectedNavbar /> : <Navbar />}
      <h1 className="text-center text-white text-5xl font-bold my-2 p-8">
        Faites vous tatouer grâce à Ink
      </h1>

      {/* ---------- Bannière ---------- */}
      <div className="bg_landingpage mb-9">
        <img src="/assets/bg_landingpage.jpeg"/>
      </div>

      <div className="bg-[#282828] text-white flex flex-col gap-y-24">
        {/* ---------- 1ère section ---------- */}
        <div className="flex text-center justify-center mt-6">
          <div className="w-1/2 flex flex-col items-center justify-center">
            <h2 className="w-1/2 text-3xl font-bold">Cherchez une idée</h2>
            <p className="w-1/2 text-base">
              Envie d'un nouveau tatouage ? Cherchez et trouvez votre idée en
              vous inspirant sur Ink
            </p>
            <div className="flex justify-center py-5">
              <button className="bg-white rounded-3xl p-3 text-black">
                <Link href="/post-list">Explorer</Link>
              </button>
            </div>
          </div>
          <div className="w-1/2 flex items-center justify-center">
            <img
              src="/assets/landingpage_sample_3.jpg"
              className="w-1/3 rounded-3xl self-start mt-6 z-50"
            />
            <img
              src="/assets/landingpage_sample_12.jpg"
              className="w-1/3 rounded-3xl mx-[-40px] z-0"
            />
            <img
              src="/assets/landingpage_sample_1.jpg"
              className="w-1/3 rounded-3xl self-end mb-6 z-50"
            />
          </div>
        </div>

        {/* ---------- 2e section ---------- */}
        <div className="flex text-center justify-center">
          <div className="w-1/2 flex items-center justify-center">
            <img
              src="/assets/landingpage_sample_4.jpg"
              className="w-1/3 rounded-3xl self-start mt-[-50px] z-50"
            />
            <img
              src="/assets/landingpage_sample_5.jpg"
              className="w-1/3 rounded-3xl mx-[-25px] z-0"
            />
            <img
              src="/assets/landingpage_sample_6.jpg"
              className="w-1/3 rounded-3xl self-end mb-[-50px] z-50"
            />
          </div>
          <div className="w-1/2 flex flex-col items-center justify-center">
            <h2 className="w-1/2 text-3xl font-bold">Trouvez votre tatoueur</h2>
            <p className="w-1/2 text-base">
              Choisissez, discutez et prenez rendez-vous en quelques cliques
              avec nos milliers d'artistes présents sur Ink
            </p>
            <div className="flex justify-center py-5">
              <button className="bg-white rounded-3xl p-3 text-black">
                <Link href="/post-list">Explorer</Link>
              </button>
            </div>
          </div>
        </div>

        {/* ---------- 3e section ---------- */}
        <div className="flex text-center justify-center">
          <div className="w-1/2 flex flex-col items-center justify-center">
            <h2 className="w-1/2 text-3xl font-bold">Partagez !</h2>
            <p className="w-1/2 text-base">
              Découvrez et rejoignez une immense communauté de passionnés comme
              vous !
            </p>
            <div className="flex justify-center py-5">
              <button className="bg-white rounded-3xl p-3 text-black">
                <Link href="/post-list">Explorer</Link>
              </button>
            </div>
          </div>
          <div className="w-1/2 flex items-center justify-center">
            <img
              src="/assets/landingpage_sample_10.jpg"
              className="w-1/3 rounded-3xl self-end mb-[-30px] z-50"
            />
            <img
              src="/assets/landingpage_sample_8.jpg"
              className="w-1/3 rounded-3xl mx-[-25px] z-0"
            />
            <img
              src="/assets/landingpage_sample_9.jpg"
              className="w-1/3 rounded-3xl self-start mt-[-30px] z-50"
            />
          </div>
        </div>

        {/* ---------- Footer/Inscription ---------- */}
        <div className="flex text-center items-center justify-center mx-52">
          <p>
            Ink. est une plateforme qui transforme la manière dont
            vous recherchez et prenez rendez-vous avec des tatoueurs. Notre
            interface réseau social, vous permet de vous
            connecter avec une communauté qui partage votre passion et d'échanger
            des recommandations. Venez découvrir les meilleurs artistes près de
            chez vous !
          </p>
        </div>
        <div className="flex justify-center my-4">
          <button className="bg-[#E9E9E9] w-1/4 rounded-3xl p-3 text-black">
            <Link href="/sign-in">S'inscrire</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
