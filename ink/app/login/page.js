'use client';
import Navbar from '@/components/flow/navbar';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import ConnectedNavbar from '@/components/flow/connected-navbar';
import { signIn, useSession } from 'next-auth/react';

export default function Login() {
  const [pseudo, setPseudo] = useState(null);
  const [password, setPassword] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    signIn('credentials', {
      redirect: false,
      pseudo: pseudo,
      password: password,
      isUpdating: 'false',
    }).then((res) => {
      if (res.status !== 200) {
        toast.error('User not found');
      } else {
        router.push('/post-list');
      }
    });
  }

  return (
    <div className="body bg-[#282828] text-white">
      {session ? <ConnectedNavbar /> : <Navbar />}
      <div className="flex flex-row justify-center items-center text-center h-screen">
        {/* ---------- Images ---------- */}
        <div className="w-1/2 flex items-center justify-center">
          <img
            src="/assets/login_sample_2.jpg"
            className="w-1/3 rounded-3xl self-start mt-6 z-50"
          />
          <img
            src="/assets/login_sample.jpg"
            className="w-1/3 rounded-3xl mx-[-40px] z-0"
          />
          <img
            src="/assets/login_sample_1.jpg"
            className="w-1/3 rounded-3xl self-end mb-6 z-50"
          />
        </div>

        {/* ---------- Formulaire ---------- */}
        <div className="w-1/2 flex justify-center p-10 gap-4">
          <div className="w-2/3">
            <p className="text-base m-5">
              Redécouvrez le monde du tatouage avec Ink !
            </p>
            <h1 className="text-3xl font-bold mb-4">Connexion</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Pseudo"
                onChange={(e) => setPseudo(e.target.value)}
                className="bg-[#E9E9E9] text-black py-2 px-4 rounded"
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#E9E9E9] text-black py-2 px-4 rounded"
              />
              <button
                type="submit"
                className="bg-[#141414] text-white py-2 px-4 rounded hover:bg-[#080808]"
              >
                Se connecter
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
