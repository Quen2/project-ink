import axios from 'axios';
import { toast } from 'react-toastify';

export default function Create({
  pseudo,
  email,
  phoneNumber,
  password,
  isArtist,
}) {
  return axios
    .post('api/user/sign-in', {
      pseudo,
      email,
      phoneNumber,
      password,
      isArtist,
    })
    .then((response) => {
      toast.success(response.data.message);
      return response.data.user
    })
    .catch((error) => {
      console.log(error);
    });
}
