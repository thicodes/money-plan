import mongoose, { Document, Model } from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    bank: {
      type: String,
      required: false,
    },
    kind: {
      type: String,
      required: true,
      enum: ['checking account', 'saving account/investiments', 'other'],
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'account',
  },
);

export interface IAccount extends Document {
  name?: string;
  bank?: string;
  kind: string;
}

const AccountModel: Model<IAccount> = mongoose.model('Account', schema);

export default AccountModel;
