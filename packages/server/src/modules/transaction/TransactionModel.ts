import mongoose, { Document, Model } from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    isExpense: {
      type: Boolean,
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
    isPaid: {
      type: Boolean,
      required: true,
      default: true,
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
  date: string;
  isExpense: boolean;
  kind: string;
  kindModel: string;
  isPaid: boolean;
  tags?: Array<string>;
}

const TransactionModel: Model<ITransaction> = mongoose.model('Transaction', schema);

export default TransactionModel;
