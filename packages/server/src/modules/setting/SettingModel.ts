import mongoose, { Document, Model } from 'mongoose';

const schema = new mongoose.Schema(
  {
    currency: {
      type: String,
      required: true,
    },
    isFinishedSetup: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'setting',
  },
);

export interface ISetting extends Document {
  currency: string;
  isFinishedSetup: boolean;
}

const SettingModel: Model<ISetting> = mongoose.model('Setting', schema);

export default SettingModel;
