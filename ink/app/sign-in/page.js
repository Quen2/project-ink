'use client';

import Navbar from '@/components/flow/navbar';
import { useState } from 'react';
import CompleteProfile from '@/components/flow/complete-profile';
import Create from '@/services/user/create';

export default function SignIn() {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isArtist, setIsArtist] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!pseudo || !email || !password || (isArtist && !phoneNumber)) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (!isArtist) {
      await Create({ pseudo, email, phoneNumber, password, isArtist })
        .then((response) => {
          setUser(response);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const tempUser = {
        pseudo: pseudo,
        email: email,
        phoneNumber: phoneNumber,
        password: password,
        isArtist: isArtist,
      };
      setUser(tempUser);
    }
  };

  return (
    <div className="body bg-[#282828] text-white">
      <Navbar />
      {user ? (
        <CompleteProfile user={user} isCreated={!isArtist} />
      ) : (
        <div className="flex flex-row justify-center items-center text-center h-screen">
          {/* ---------- Formulaire ---------- */}
          <div className="w-1/2 flex justify-center p-10 gap-4">
            <div className="w-2/3">
              <p className="text-base m-5">
                C'est rapide et facile !
              </p>
              <h1 className="text-3xl font-bold mb-4">Créer un compte Ink</h1>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Pseudo"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  className="mt-1 block w-full py-2 px-4 rounded text-black"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full text-black py-2 px-4 rounded"
                  required
                />
                <input
                  type="tel"
                  placeholder="Numéro de téléphone"
                  value={phoneNumber}
                  required={isArtist}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1 block w-full text-black py-2 px-4 rounded"
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full text-black py-2 px-4 rounded"
                  required
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isArtist"
                    checked={isArtist}
                    onChange={(e) => setIsArtist(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="isArtist">Je suis tatoueur/se</label>
                </div>
                <button
                  type="submit"
                  className="bg-[#141414] text-white py-2 px-4 rounded hover:bg-[#080808]"
                >
                  S'inscrire
                </button>
              </form>
            </div>
          </div>

          {/* ---------- Images ---------- */}
          <div className="w-1/2 flex items-center justify-center">
            <img
              src="/assets/signin_sample_1.jpg"
              className="w-1/3 rounded-3xl self-start mt-6 z-50"
            />
            <img
              src="/assets/signin_sample_2.jpg"
              className="w-1/3 rounded-3xl mx-[-40px] z-0"
            />
            <img
              src="/assets/signin_sample.jpg"
              className="w-1/3 rounded-3xl self-end mb-6 z-50"
            />
          </div>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        </div>
      )}
    </div>
  );
}
