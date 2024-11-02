import mongoose, { Schema } from 'mongoose';

const ObjectId = Schema.ObjectId;
const postSchema = new Schema(
  {
    authorId: ObjectId,
    title: String,
    style: String,
    fileName: String,
    localisation: String,
    description: String,
    comment: [
      {
        authorId: ObjectId,
        comment: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Posts = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Posts;
