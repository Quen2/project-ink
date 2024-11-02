import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    title: {
        type: String,
        enum: ['cartoon', 'old-school', 'realist', 'cover', 'floral'],
    },
    picture: String
  }
);

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;
