import mongoose, { Schema } from 'mongoose';

const ObjectId = Schema.ObjectId;
const userSchema = new Schema(
  {
    pseudo: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: false,
      unique: false,
    },
    password: {
      type: String,
      required: true,
    },
    isArtist: {
      type: Boolean,
      required: true,
    },
    profilePicture: {
      type: String,
      required: false,
    },
    birthDate: {
      type: Date,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    siret: {
      type: String,
      required: false,
    },
    biography: {
      type: String,
      required: false,
    },
    payment: [
      {
        bic: {
          type: String,
          unique: true,
        },
        iban: {
          type: String,
          unique: true,
        },
        lastname: {
          type: String,
        },
        firstname: {
          type: String,
        },
      },
    ],
    // address: {
    //     type: String,
    //     required: function() {
    //         return this.isArtist;
    //         }
    // },
    // paymentInfo: {
    //     type: [{
    //         cardNumber: {
    //             type: String,
    //             required: true,
    //             maxlength: 255
    //         },
    //         cardName: {
    //             type: String,
    //             required: true,
    //             maxlength: 255
    //         },
    //         expiryDate: {
    //             type: Date,
    //             required: true
    //         },
    //         cvv: {
    //             type: Number,
    //             required: true,
    //             min: 100,
    //             max: 9999
    //         }
    //     }],
    //     required: false
    // },
    followers: [
      {
        userId: ObjectId,
        pseudo: String,
        profilePicture: String,
      },
    ],
  },
  {
    timestamps: true,
    strict: false,
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
