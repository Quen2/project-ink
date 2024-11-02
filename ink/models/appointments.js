import mongoose, { Schema } from 'mongoose';

const ObjectId = Schema.ObjectId;
const appointmentsSchema = new Schema({
  userId: {
    type: ObjectId,
    required: true,
  },
  artistId: {
    type: ObjectId,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['personal', 'flash'],
  },
  description: {
    type: String,
    required: false,
  },
  bodyPlacement: {
    type: String,
    required: false,
  },
  images: {
    type: [String],
    required: false,
  },
  status: {
    type: Number,
    required: true,
  },
  depositPaid: {
    type: Boolean,
    default: false,
  },
  appointmentDate: {
    type: Date,
    required: false,
  },
});

const Appointments =
  mongoose.models.Appointments ||
  mongoose.model('Appointments', appointmentsSchema);

export default Appointments;