import mongoose, { Document, Model } from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    transactions: [
      {
        type: ObjectId,
        ref: 'CreditCard',
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'tag',
  },
);

export interface ITag extends Document {
  name: string;
  transactions: Array<string>;
}

const TagModel: Model<ITag> = mongoose.model('Tag', schema);

export default TagModel;
