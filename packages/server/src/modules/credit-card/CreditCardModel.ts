import mongoose, { Document, Model } from 'mongoose';

const schema = new mongoose.Schema(
  {
    institutionFlag: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    limit: {
      type: String,
      required: true,
    },
    closingDay: {
      type: Number,
      required: true,
    },
    dueDay: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'creditCard',
  },
);

export interface ICreditCard extends Document {
  institutionFlag: string;
  name: string;
  limit: string;
  closingDay: number;
  dueDay: number;
}

const CreditCardModel: Model<ICreditCard> = mongoose.model('CreditCard', schema);

export default CreditCardModel;
