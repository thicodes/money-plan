import mongoose, { Document, Model } from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    kind: {
      type: String,
      required: true,
      refPath: 'kindModel',
    },
    kindModel: {
      type: String,
      required: true,
      enum: ['CreditCard', 'Account'],
    },
    tags: [
      {
        type: ObjectId,
        ref: 'Tag',
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'transaction',
  },
);

export interface ITransaction extends Document {
  name: string;
  kind: string;
  kindModel: string;
  tags?: Array<string>;
}

const TransactionModel: Model<ITransaction> = mongoose.model('Transaction', schema);

export default TransactionModel;
