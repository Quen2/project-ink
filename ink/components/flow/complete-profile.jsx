import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { signIn } from 'next-auth/react';

export default function CompleteProfile({
  user,
  setIsUpdatingProfile = () => {},
  isUpdating = false,
  isCreated = true,
}) {
  const [pseudo, setPseudo] = useState(user.pseudo);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? '');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState(
    user.birthDate ? user.birthDate.split('T')[0] : ''
  );
  const [profilePicture, setProfilePicture] = useState(
    `/assets/${user.profilePicture ?? 'default.png'}`
  );
  const [newProfilePictureData, setNewProfilePictureData] = useState('');
  const [siretNumber, setSiretNumber] = useState(user.siret ?? '');
  const [address, setAddress] = useState(user.address ?? '');
  const [biography, setBiography] = useState(user.biography ?? '');
  const [currentTab, setCurrentTab] = useState('general');
  const [errorMessage, setErrorMessage] = useState('');
  const [bic, setBic] = useState(user.payment ? user.payment[0].bic : '');
  const [iban, setIban] = useState(user.payment ? user.payment[0].iban : '');
  const [firstname, setFirstname] = useState(
    user.payment ? user.payment[0].firstname : ''
  );
  const [lastname, setLastname] = useState(
    user.payment ? user.payment[0].lastname : ''
  );
  const isArtist = user.isArtist;
  const router = useRouter();

  function handleChange(e) {
    setNewProfilePictureData(e.target.files[0]);
    setProfilePicture(URL.createObjectURL(e.target.files[0]));
  }

  const completeProfile = async (event) => {
    event.preventDefault();

    if (!pseudo || !email || (isArtist && !phoneNumber)) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires.');
      setCurrentTab('general');
      return;
    }

    if (isArtist && (!siretNumber || !address)) {
      setErrorMessage(
        'Veuillez remplir tous les champs obligatoires pour les tatoueurs.'
      );
      setCurrentTab('business');
      return;
    }

    try {
      let uploadedImageName = user.profilePicture;

      if (newProfilePictureData) {
        const formData = new FormData();
        formData.append('file', newProfilePictureData);
        formData.append('oldProfilePicture', uploadedImageName);

        const uploadResponse = await axios.post('/api/upload-img', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        uploadedImageName = uploadResponse.data.imagesNames[0];
      }

      const data = {
        pseudo: pseudo || user.pseudo,
        email: email || user.email,
        phoneNumber: phoneNumber || user.phoneNumber,
        birthDate: birthDate || user.birthDate,
        password: password,
        biography: biography || user.biography,
        ...(user.isArtist && {
          siret: siretNumber || user.siret,
          address: address || user.address,
          iban: iban || user.iban,
          bic: bic || user.bic,
          lastname: lastname || user.lastname,
          firstname: firstname || user.firstname,
        }),
        profilePicture: uploadedImageName
          ? uploadedImageName
          : user.profilePicture,
        isArtist: user.isArtist,
      };

      if (isCreated) {
        axios
          .put('/api/user/' + user._id, data)
          .then((response) => {
            toast.success(response.data.message);
            setIsUpdatingProfile(false);
            openSessionAndRedirect()
          })
          .catch((error) => {
            console.error(error);
            toast.error(error.message);
          });
      } else {
        axios
          .post('api/user/sign-in', data)
          .then((response) => {
            toast.success(response.data.message);
            openSessionAndRedirect()
          })
          .catch((error) => console.error(error));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  function openSessionAndRedirect () 
  {
    signIn('credentials', {
      redirect: false,
      pseudo: user.pseudo,
      password: user.password,
      isUpdating: 'true'
    }).then((res) => {
      if (res.status !== 200) {
        toast.error('User not found');
      } else if(window.location.pathname === '/sign-in') {
        router.push('/post-list');
      }
    });
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black">
      <div className="bg-white p-8 rounded shadow-lg w-1/3">
        <h2 className="text-2xl mb-4">Compléter le profil</h2>
        {isUpdating && (
          <button
            onClick={() => {
              setIsUpdatingProfile(false);
              setCurrentTab('general');
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            X
          </button>
        )}
        <div className="mb-4 border-b border-gray-200">
          <nav className="flex space-x-4">
            <button
              className={`py-2 px-4 ${
                currentTab === 'general' ? 'border-b-2 border-blue-500' : ''
              }`}
              onClick={() => setCurrentTab('general')}
            >
              Général
            </button>
            <button
              className={`py-2 px-4 ${
                currentTab === 'biography' ? 'border-b-2 border-blue-500' : ''
              }`}
              onClick={() => setCurrentTab('biography')}
            >
              Biographie
            </button>
            {isArtist && (
              <button
                className={`py-2 px-4 ${
                  currentTab === 'business' ? 'border-b-2 border-blue-500' : ''
                }`}
                onClick={() => setCurrentTab('business')}
              >
                Entreprise
              </button>
            )}
            {user.isArtist && (
              <button
                className={`py-2 px-4 ${
                  currentTab === 'payment' ? 'border-b-2 border-blue-500' : ''
                }`}
                onClick={() => setCurrentTab('payment')}
              >
                Informations bancaire
              </button>
            )}
          </nav>
        </div>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <form className="flex flex-col gap-4" onSubmit={completeProfile}>
          {currentTab === 'general' && (
            <>
              <input
                type="text"
                placeholder={user.pseudo ? user.pseudo : 'Pseudo*'}
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
                required
              />
              <input
                type="text"
                placeholder={user.email ? user.email : 'Email*'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
                required
              />
              <input
                type="text"
                placeholder={
                  user.phoneNumber
                    ? user.phoneNumber
                    : isArtist
                    ? 'Numéro de téléphone*'
                    : 'Numéro de téléphone'
                }
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
                required={isArtist}
              />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
              />
              <input
                type="password"
                placeholder="Mot de passe*"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
              />
            </>
          )}
          {currentTab === 'biography' && (
            <>
              <img
                src={profilePicture}
                alt={`Photo de profil de ${user.pseudo}`}
                className="w-32 h-32 mx-auto rounded-full"
              />
              <input
                type="file"
                id="inputFile"
                className="m-2 w-1/2"
                onChange={handleChange}
              />
              <textarea
                placeholder={
                  user.biography ? user.biography : 'Parle nous de toi !'
                }
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded h-32 resize-none"
              />
            </>
          )}
          {isArtist && currentTab === 'business' && (
            <>
              Numéro de SIRET*
              <input
                type="text"
                placeholder={user.siret ? user.siret : 'Numero de SIRET*'}
                value={siretNumber}
                onChange={(e) => setSiretNumber(e.target.value)}
                className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
                required
              />
              Adresse*
              <input
                type="text"
                placeholder={user.address ? user.address : 'Adresse*'}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
                required
              />
            </>
          )}
          {user.isArtist && currentTab === 'payment' && (
            <>
              <input
                type="text"
                placeholder={lastname ? lastname : 'Nom de famille'}
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
              />
              <input
                type="text"
                placeholder={firstname ? firstname : 'Prénom'}
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
              />
              <input
                type="text"
                placeholder={iban ? iban : 'Iban'}
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
              />
              <input
                type="text"
                placeholder={bic ? bic : 'bic'}
                value={bic}
                onChange={(e) => setBic(e.target.value)}
                className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
              />
            </>
          )}
          <div className="flex items-center">
            <button
              type="submit"
              className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900"
            >
              Compléter le profil
            </button>
          </div>
        </form>
        {!isArtist && !isUpdating ? (
          <button
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded border border-gray-400 hover:bg-gray-400 hover:text-white"
            onClick={openSessionAndRedirect}
          >
            Ignorer pour le moment
          </button>
        ) : null}
      </div>
    </div>
  );
}
