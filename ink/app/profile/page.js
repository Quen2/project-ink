/* "use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import ConnectedNavbar from "@/components/flow/connected-navbar";
import PostList from "@/components/flow/post-list";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isDeletingProfile, setIsDeletingProfile] = useState(false);
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [siretNumber, setSiretNumber] = useState("");
  const [address, setAddress] = useState("");
  const [biography, setBiography] = useState("");
  const [currentTab, setCurrentTab] = useState("general");
  const [bic, setBic] = useState("");
  const [iban, setIban] = useState("");
  const [firstname, setFirstame] = useState("");
  const [lastname, setLastname] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/user/" + window.localStorage.getItem("userId"))
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isUpdatingProfile]);

  function updateProfile(event) {
    event.preventDefault();

    if (uploadedFile) {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      axios
        .post("/api/upload-img", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch((error) => console.log(error));
    }

    axios
      .put("/api/user/" + window.localStorage.getItem("userId"), {
        pseudo: pseudo || user.pseudo,
        email: email || user.email,
        phoneNumber: phoneNumber || user.phoneNumber,
        birthDate: birthDate || user.birthDate,
        password: password,
        ...(user.isArtist && {
          siret: siretNumber || user.siret,
          address: address || user.address,
          biography: biography || user.biography,
          iban: iban || user.iban,
          bic: bic || user.bic,
          lastname: lastname || user.lastname,
          firstname: firstname || user.firstame,
        }),
        profilePicture: uploadedFile ? uploadedFile.name : user.profilePicture,
      })
      .then((response) => {
        toast.success("Profil mis à jour ! 😀");
        setTimeout(() => {
          router.push(`/profile`);
        }, 1000);
        setIsUpdatingProfile(false);
      })
      .catch((error) => console.log(error));
  }

  function deleteProfile() {
    setIsDeletingProfile(true);
    axios.delete("/api/user/" + window.localStorage.getItem("userId"));
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("isArtist");
    setTimeout(() => {
      router.push(`/`);
    }, 1000);
  }

  function saveFileUploaded() {
    const file = document.getElementById("inputFile").files[0];
    setUploadedFile(file);
  }

  return (
    <div>
      <ToastContainer />
      <ConnectedNavbar />
      {isUpdatingProfile ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-1/3">
            <h2 className="text-2xl mb-4 flex justify-between items-center">
              Compléter le profil
              <button
                onClick={() => {
                  setIsUpdatingProfile(!isUpdatingProfile);
                  setCurrentTab("general");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                X
              </button>
            </h2>
            <div className="mb-4 border-b border-gray-200">
              <nav className="flex space-x-4">
                <button
                  className={`py-2 px-4 ${
                    currentTab === "general" ? "border-b-2 border-blue-500" : ""
                  }`}
                  onClick={() => setCurrentTab("general")}
                >
                  Général
                </button>
                <button
                  className={`py-2 px-4 ${
                    currentTab === "biography"
                      ? "border-b-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => setCurrentTab("biography")}
                >
                  Biographie
                </button>
                {user.isArtist && (
                  <button
                    className={`py-2 px-4 ${
                      currentTab === "business"
                        ? "border-b-2 border-blue-500"
                        : ""
                    }`}
                    onClick={() => setCurrentTab("business")}
                  >
                    Entreprise
                  </button>
                )}
                {user.isArtist && (
                  <button
                    className={`py-2 px-4 ${
                      currentTab === "payment"
                        ? "border-b-2 border-blue-500"
                        : ""
                    }`}
                    onClick={() => setCurrentTab("payment")}
                  >
                    Informations bancaire
                  </button>
                )}
              </nav>
            </div>
            <form className="flex flex-col gap-4" onSubmit={updateProfile}>
              {currentTab === "general" && (
                <>
                  <input
                    type="text"
                    placeholder={user.pseudo}
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
                  />
                  <input
                    type="text"
                    placeholder={user.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
                  />
                  <input
                    type="text"
                    placeholder={user.phoneNumber}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
                  />
                  <input
                    type="date"
                    placeholder={user.birthDate}
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
                  />
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
                  />
                </>
              )}
              {currentTab === "biography" && (
                <>
                  {user.profilePicture && (
                    <img
                      src={`/assets/${user.profilePicture}`}
                      alt={`Photo de profil de ${user.pseudo}`}
                      className="w-32 h-32 mx-auto rounded-full"
                    />
                  )}
                  <input
                    type="file"
                    id="inputFile"
                    className="m-2 w-1/2"
                    onChange={(e) => {
                      saveFileUploaded();
                    }}
                  />
                  {user.isArtist && (
                    <label className="block text-gray-700">
                      Parle nous de toi !
                      <textarea
                        placeholder={user.biography}
                        value={biography}
                        onChange={(e) => setBiography(e.target.value)}
                        className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded h-32 resize-none"
                      />
                    </label>
                  )}
                </>
              )}
              {user.isArtist && currentTab === "business" && (
                <>
                  <input
                    type="text"
                    placeholder={user.siret ? user.siret : "Numero de siret"}
                    value={siretNumber}
                    onChange={(e) => setSiretNumber(e.target.value)}
                    className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
                  />
                  <input
                    type="text"
                    placeholder={user.address ? user.address : "Adresse postal"}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
                  />
                </>
              )}
              {user.isArtist && currentTab === "payment" && (
                <>
                  <input
                    type="text"
                    placeholder={
                      user.payment && user.payment.length
                        ? user.payment[0].lastname
                        : "Nom de famille"
                    }
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
                  />
                  <input
                    type="text"
                    placeholder={
                      user.payment && user.payment.length
                        ? user.payment[0].firstame
                        : "Prénom"
                    }
                    value={firstname}
                    onChange={(e) => setFirstame(e.target.value)}
                    className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
                  />
                  <input
                    type="text"
                    placeholder={
                      user.payment && user.payment.length
                        ? user.payment[0].iban
                        : "Iban"
                    }
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    className="mt-1 block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded"
                  />
                  <input
                    type="text"
                    placeholder={
                      user.payment && user.payment.length
                        ? user.payment[0].bic
                        : "Numéro BIC"
                    }
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
          </div>
        </div>
      ) : null}
      {isDeletingProfile ? (
        <div className="modal">
          <div className="text-white">
            <p>Supprimer votre compte Ink.</p>
            <p onClick={deleteProfile}>Valider</p>
            <p
              onClick={() => {
                setIsDeletingProfile(!isDeletingProfile);
              }}
            >
              Retour
            </p>
          </div>
        </div>
      ) : null}
      {user && (
        <div className="bg-[#282828] text-white rounded-2xl w-1/2 mx-auto text-center p-2">
          <p>Bonjour {user.pseudo}</p>
          <p>Vos informations :</p>
          <p>Email : {user.email}</p>
          {user.isArtist && <p>Adresse : {user.address}</p>}
          {user.phoneNumber && <p>Téléphone : {user.phoneNumber}</p>}
          {user.profilePicture ? (
            <img
              src={`/assets/${user.profilePicture}`}
              alt={`Photo de profil de ${user.pseudo}`}
              className="w-32 h-32 mx-auto rounded-full"
            />
          ) : (
            <div className="w-32 h-32 mx-auto bg-gray-400 rounded-full flex items-center justify-center">
              <p className="text-gray-700 text-sm">Placeholder</p>
            </div>
          )}
          {user.biography && <p>{user.biography}</p>}
          <div className="flex justify-center gap-4">
            <p
              className="hover:bg-[#353535] cursor-pointer rounded-xl"
              onClick={() => setIsUpdatingProfile(!isUpdatingProfile)}
            >
              Modifier mes informations
            </p>
            <p
              className="hover:bg-[#353535] cursor-pointer rounded-xl"
              onClick={() => setIsDeletingProfile(!isDeletingProfile)}
            >
              Supprimer mon compte
            </p>
          </div>
          {user.isArtist ? (
            <>
              <p>
                Nombre de personnes qui vous suivent : {user.followers.length}
              </p>
              <button className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900">
                Créer un Post
              </button>
              <button className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900">
                <Link href="/appointment">Prendre un rendez-vous</Link>
              </button>
              <div>
                <PostList userId={user._id} />
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
} */
