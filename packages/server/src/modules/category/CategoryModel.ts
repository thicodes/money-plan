import mongoose, { Document, Model } from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'category',
  },
);

export interface ICategory extends Document {
  name?: string;
}

const CategoryModel: Model<ICategory> = mongoose.model('Category', schema);

export default CategoryModel;
